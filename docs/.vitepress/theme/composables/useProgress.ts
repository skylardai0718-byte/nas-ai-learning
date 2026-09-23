import { ref, readonly, onMounted, toRaw } from 'vue'
import { inBrowser } from 'vitepress'
import {
  CURRENT_SCHEMA_VERSION,
  type AppState,
  type LessonRecord,
  type MistakeStatus,
  type QuizAttempt,
  type ReviewItem,
  type Tier,
} from './types'

export const STORAGE_KEY = 'nasai:state'

function createEmptyState(): AppState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: '',
    updatedAt: '',
    lessons: {},
    reviewQueue: [],
    domainOverrides: {},
    settings: { showAnswersImmediately: false },
  }
}

/**
 * 模块级单例。空值 + 确定性初始化：服务端渲染和客户端首次渲染结果完全一致，
 * 因此不会出现 hydration mismatch。真正的数据在 onMounted 里才填进去。
 */
const state = ref<AppState>(createEmptyState())
const hydrated = ref(false)
const storageAvailable = ref(true)

/** 每道题的复测间隔：🔴 两天后重来，🟡 一周后重来 */
const REVIEW_INTERVAL_DAYS: Record<MistakeStatus, number> = {
  red: 2,
  yellow: 7,
  green: 0,
}

function migrate(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object') return null
  const anyRaw = raw as Partial<AppState>

  if (anyRaw.schemaVersion === CURRENT_SCHEMA_VERSION) {
    return { ...createEmptyState(), ...anyRaw } as AppState
  }

  // 版本不认识：备份原始数据再重置，绝不静默清空学习记录
  try {
    localStorage.setItem(
      `${STORAGE_KEY}:backup:${Date.now()}`,
      JSON.stringify(raw),
    )
  } catch {
    /* 备份失败也只能继续，至少不要卡住页面 */
  }
  console.warn(
    `[progress] 数据版本 ${anyRaw.schemaVersion} 与当前版本 ${CURRENT_SCHEMA_VERSION} 不符，` +
      `已备份原始数据并重新开始。`,
  )
  return null
}

function hydrate() {
  if (!inBrowser) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = migrate(JSON.parse(raw))
      if (parsed) {
        state.value = parsed
        if (!state.value.createdAt) {
          state.value.createdAt = new Date().toISOString()
        }
      }
    } else {
      state.value = createEmptyState()
      state.value.createdAt = new Date().toISOString()
    }
  } catch (error) {
    storageAvailable.value = false
    console.warn(
      '[progress] 无法读取本地进度（可能是无痕模式或存储被禁用），本次学习进度不会被保存。',
      error,
    )
  }
  hydrated.value = true
}

function persist() {
  if (!inBrowser) return
  state.value.updatedAt = new Date().toISOString()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch (error) {
    storageAvailable.value = false
    console.warn('[progress] 无法保存进度（存储空间已满或被禁用）。', error)
  }
}

/**
 * 只有显式写入才 copy-on-write，避免 readonly 包装挡住内部更新。
 *
 * toRaw 不能省：state.value 是 reactive Proxy，而 structuredClone 按规范
 * 拒绝克隆 Proxy，会抛 DataCloneError。少了这一层，每次写入都会静默失败，
 * 表现为「提交并批改」点了没反应、进度也从不落盘。
 */
function mutate(fn: (draft: AppState) => void) {
  const draft = structuredClone(toRaw(state.value))
  fn(draft)
  state.value = draft
  persist()
}

function ensureLesson(draft: AppState, lessonId: string): LessonRecord {
  if (!draft.lessons[lessonId]) {
    draft.lessons[lessonId] = {
      visitedAt: null,
      completedAt: null,
      attempts: [],
      latestTier: null,
    }
  }
  return draft.lessons[lessonId]
}

function addDaysISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function useProgress() {
  onMounted(hydrate)

  return {
    state: readonly(state),
    hydrated: readonly(hydrated),
    storageAvailable: readonly(storageAvailable),

    markVisited(lessonId: string) {
      mutate((draft) => {
        const lesson = ensureLesson(draft, lessonId)
        if (!lesson.visitedAt) lesson.visitedAt = new Date().toISOString()
      })
    },

    setCompleted(lessonId: string, completed: boolean) {
      mutate((draft) => {
        const lesson = ensureLesson(draft, lessonId)
        lesson.completedAt = completed ? new Date().toISOString() : null
      })
    },

    /** 记录一次作答，并据此更新复测队列 */
    recordAttempt(attempt: QuizAttempt, items: ReviewItem[]) {
      mutate((draft) => {
        const lesson = ensureLesson(draft, attempt.lessonId)
        lesson.attempts.push(attempt)
        if (attempt.tier) lesson.latestTier = attempt.tier

        // 同一题重复作答时，用最新结果覆盖旧的复测条目
        const ids = new Set(items.map((i) => i.questionId))
        draft.reviewQueue = draft.reviewQueue.filter(
          (i) => i.lessonId !== attempt.lessonId || !ids.has(i.questionId),
        )

        for (const item of items) {
          if (item.status === 'green') continue
          draft.reviewQueue.push({
            ...item,
            dueAt: addDaysISO(REVIEW_INTERVAL_DAYS[item.status]),
          })
        }
      })
    },

    resolveReview(questionId: string, lessonId: string, status: MistakeStatus) {
      mutate((draft) => {
        draft.reviewQueue = draft.reviewQueue.filter(
          (i) => !(i.lessonId === lessonId && i.questionId === questionId),
        )
        if (status !== 'green') {
          draft.reviewQueue.push({
            lessonId,
            questionId,
            lessonTitle: '',
            stem: '',
            status,
            dueAt: addDaysISO(REVIEW_INTERVAL_DAYS[status]),
          })
        }
      })
    },

    setDomainOverride(domain: string, level: Tier | string, note = '') {
      mutate((draft) => {
        draft.domainOverrides[domain as never] = {
          level: level as never,
          note,
          at: new Date().toISOString(),
        }
      })
    },

    clearDomainOverride(domain: string) {
      mutate((draft) => {
        delete draft.domainOverrides[domain as never]
      })
    },

    replaceState(next: AppState) {
      state.value = { ...createEmptyState(), ...next }
      hydrated.value = true
      persist()
    },

    reset() {
      mutate((draft) => {
        const fresh = createEmptyState()
        Object.assign(draft, fresh, { createdAt: new Date().toISOString() })
      })
    },
  }
}
