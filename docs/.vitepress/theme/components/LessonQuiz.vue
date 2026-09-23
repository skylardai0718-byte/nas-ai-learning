<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import QuizQuestion from './QuizQuestion.vue'
import SelfAssess from './SelfAssess.vue'
import ReferenceAnswer from './ReferenceAnswer.vue'
import { useProgress } from '../composables/useProgress'
import {
  autoScoreOf,
  loadQuiz,
  overallTier,
  selfScoreOf,
  TIER_STATUS,
  suggestTier,
} from '../composables/useQuiz'
import type {
  Domain,
  DomainTally,
  QuizAttempt,
  QuizBank,
  ReviewItem,
  StoredAnswer,
  SubjectiveAnswer,
  Tier,
} from '../composables/types'

const props = defineProps<{ lessonId: string }>()
const { frontmatter } = useData()
const { hydrated, state, recordAttempt } = useProgress()

const bank = ref<QuizBank | null>(null)
const loadState = ref<'checking' | 'absent' | 'ready'>('checking')
const phase = ref<'idle' | 'active' | 'graded'>('idle')
const answers = ref<Record<string, StoredAnswer>>({})
const summaryText = ref('')
const summaryChecked = ref<string[]>([])
const summaryRating = ref<Tier | null>(null)

const lessonTitle = computed(() => frontmatter.value.title ?? props.lessonId)

onMounted(async () => {
  const loaded = await loadQuiz(props.lessonId)
  if (!loaded) {
    // 题库还没写：静默不渲染，55 个课件在补齐过程中这是常态
    loadState.value = 'absent'
    return
  }
  bank.value = loaded
  loadState.value = 'ready'
})

const counts = computed(() => ({
  recall: bank.value?.recall.length ?? 0,
  objective:
    bank.value?.questions.filter(
      (q) => q.type === 'choice' || q.type === 'truefalse',
    ).length ?? 0,
  subjective:
    bank.value?.questions.filter(
      (q) => q.type === 'short' || q.type === 'scenario',
    ).length ?? 0,
  hasSummary: Boolean(bank.value?.summary),
}))

const lastAttempt = computed(() => {
  const attempts = state.value.lessons[props.lessonId]?.attempts ?? []
  return attempts[attempts.length - 1] ?? null
})

function start() {
  answers.value = {}
  summaryText.value = ''
  summaryChecked.value = []
  summaryRating.value = null
  phase.value = 'active'
}

/** 已作答的题数，用来做提交前的完整度提示 */
const answeredCount = computed(() => {
  const q = bank.value?.questions ?? []
  return q.filter((question) => {
    const a = answers.value[question.id]
    if (!a) return false
    if (a.type === 'choice') return Boolean(a.value)
    if (a.type === 'truefalse') return a.value !== undefined
    return Boolean(a.text)
  }).length
})

function computePerDomain(answersMap: Record<string, StoredAnswer>) {
  const perDomain: Partial<Record<Domain, DomainTally>> = {}
  const fallbackDomains = bank.value?.domains ?? []

  for (const question of bank.value?.questions ?? []) {
    const answer = answersMap[question.id]
    if (!answer) continue

    const domains = (question.domains ?? fallbackDomains) as Domain[]
    const weight = question.weight ?? 1

    let earned: number
    if (answer.type === 'choice' || answer.type === 'truefalse') {
      earned = answer.correct ? weight : 0
    } else {
      if (!answer.rating) continue // 没自评就不计入，避免白送分
      const tierValue = { 完全理解: 1, 基本理解: 0.75, 表面理解: 0.4, 存在误区: 0 }[
        answer.rating
      ]
      earned = tierValue * weight
    }

    for (const domain of domains) {
      const tally = perDomain[domain] ?? { earned: 0, total: 0, count: 0 }
      tally.earned += earned
      tally.total += weight
      tally.count += 1
      perDomain[domain] = tally
    }
  }

  return perDomain
}

function buildReviewItems(bankData: QuizBank): ReviewItem[] {
  const items: ReviewItem[] = []

  for (const question of bankData.questions) {
    const answer = answers.value[question.id]
    if (!answer) continue

    let tier: Tier
    if (answer.type === 'choice' || answer.type === 'truefalse') {
      tier = answer.correct ? '完全理解' : '存在误区'
    } else {
      if (!answer.rating) continue
      tier = answer.rating
    }

    items.push({
      lessonId: props.lessonId,
      lessonTitle: lessonTitle.value,
      questionId: question.id,
      stem: question.stem,
      status: TIER_STATUS[tier],
      dueAt: '',
    })
  }

  return items
}

function submit() {
  const bankData = bank.value
  if (!bankData) return

  const auto = autoScoreOf(answers.value)
  const tier = overallTier(answers.value)

  const attempt: QuizAttempt = {
    at: new Date().toISOString(),
    lessonId: props.lessonId,
    autoScore: auto.score,
    totalAuto: auto.total,
    selfScore: selfScoreOf(answers.value),
    tier,
    answers: JSON.parse(JSON.stringify(answers.value)),
    perDomain: computePerDomain(answers.value),
  }

  recordAttempt(attempt, buildReviewItems(bankData))
  phase.value = 'graded'
}

const gradedResult = computed(() => {
  if (phase.value !== 'graded') return null
  const auto = autoScoreOf(answers.value)
  return { ...auto, tier: overallTier(answers.value) }
})

/* ---------- 复述题与小结 ---------- */

/**
 * 复述题的作答对象只在 textarea 的 input 事件里才创建。
 * 学习者一个字没写就直接勾自评要点时，批改回调必须先补出这个对象，
 * 否则勾选会被静默丢弃：框看起来勾上了，实际没记下来。
 */
function recallAnswer(id: string): SubjectiveAnswer {
  const prev = answers.value[id]
  if (prev && 'checkedKeyPoints' in prev) return prev
  return { type: 'recall', text: '', checkedKeyPoints: [], rating: null }
}

function setRecall(id: string, text: string) {
  answers.value[id] = { ...recallAnswer(id), text }
}

function setRecallChecked(id: string, checked: string[]) {
  answers.value[id] = { ...recallAnswer(id), checkedKeyPoints: checked }
}

function setRecallRating(id: string, rating: Tier) {
  answers.value[id] = { ...recallAnswer(id), rating }
}

const summaryLength = computed(() => summaryText.value.trim().length)

function setSummaryRating(rating: Tier) {
  summaryRating.value = rating
}
</script>

<template>
  <div v-if="loadState === 'ready' && bank" class="nasai-quiz">
    <h2 id="nasai-quiz-heading" class="nasai-quiz__title">答题与批改</h2>

    <!-- 未开始 -->
    <div v-if="phase === 'idle'" class="nasai-quiz__intro">
      <p>
        本课共 <strong>{{ counts.objective + counts.subjective }}</strong> 道测试题<template
          v-if="counts.recall"
        >
          、{{ counts.recall }} 道复述题</template
        >。建议先闭卷作答，再对照参考答案。
      </p>
      <p class="nasai-quiz__note">
        选择题和判断题会自动判分；简答题和场景题由你自己对照要点批改。
      </p>

      <p v-if="lastAttempt" class="nasai-quiz__last">
        上次作答：{{ new Date(lastAttempt.at).toLocaleString('zh-CN') }}
        <template v-if="lastAttempt.totalAuto">
          · 客观题 {{ Math.round(lastAttempt.autoScore * lastAttempt.totalAuto) }}/{{
            lastAttempt.totalAuto
          }}
        </template>
      </p>

      <button type="button" class="nasai-quiz__btn" @click="start">
        {{ lastAttempt ? '重新作答' : '开始答题' }}
      </button>
    </div>

    <!-- 作答中 / 已批改 -->
    <template v-else>
      <section v-if="bank.recall.length" class="nasai-quiz__section">
        <h3>一、复述题</h3>
        <p class="nasai-quiz__note">先不要回看上文，用自己的话回答。</p>

        <div v-for="(item, i) in bank.recall" :key="item.id" class="nasai-quiz__recall">
          <p class="nasai-quiz__recall-stem">{{ i + 1 }}. {{ item.stem }}</p>
          <textarea
            class="nasai-quiz__input"
            rows="3"
            :value="answers[item.id] && 'text' in answers[item.id] ? (answers[item.id] as any).text : ''"
            :disabled="phase === 'graded'"
            @input="setRecall(item.id, ($event.target as HTMLTextAreaElement).value)"
          />
          <SelfAssess
            v-if="phase === 'graded'"
            :key-points="[{ text: '能独立、准确地复述这一问', required: true }]"
            :checked="answers[item.id] && 'checkedKeyPoints' in answers[item.id] ? (answers[item.id] as any).checkedKeyPoints : []"
            :rating="answers[item.id] && 'rating' in answers[item.id] ? (answers[item.id] as any).rating : null"
            @update:checked="setRecallChecked(item.id, $event)"
            @update:rating="setRecallRating(item.id, $event)"
          />
        </div>
      </section>

      <section v-if="bank.summary" class="nasai-quiz__section">
        <h3>二、本课小结</h3>
        <p class="nasai-quiz__recall-stem">{{ bank.summary.stem }}</p>
        <textarea
          class="nasai-quiz__input"
          rows="3"
          :maxlength="bank.summary.maxChars * 3"
          :value="summaryText"
          :disabled="phase === 'graded'"
          @input="summaryText = ($event.target as HTMLTextAreaElement).value"
        />
        <p class="nasai-quiz__counter" :class="{ 'is-over': summaryLength > bank.summary.maxChars }">
          {{ summaryLength }} / {{ bank.summary.maxChars }} 字
        </p>

        <template v-if="phase === 'graded'">
          <ReferenceAnswer :text="bank.summary.referenceAnswer" />
          <SelfAssess
            :key-points="bank.summary.keyPoints"
            :checked="summaryChecked"
            :rating="summaryRating"
            @update:checked="summaryChecked = $event"
            @update:rating="setSummaryRating"
          />
        </template>
      </section>

      <section class="nasai-quiz__section">
        <h3>{{ bank.recall.length ? '三' : '一' }}、测试题</h3>
        <QuizQuestion
          v-for="(question, i) in bank.questions"
          :key="question.id"
          :index="i + 1"
          :question="question"
          :model-value="answers[question.id]"
          :graded="phase === 'graded'"
          @update="answers[question.id] = $event"
        />
      </section>

      <div v-if="phase === 'active'" class="nasai-quiz__actions">
        <span class="nasai-quiz__progress">
          已作答 {{ answeredCount }} / {{ bank.questions.length }} 题
        </span>
        <button
          type="button"
          class="nasai-quiz__btn"
          :disabled="answeredCount === 0"
          @click="submit"
        >
          提交并批改
        </button>
      </div>

      <div v-else-if="gradedResult" class="nasai-quiz__result">
        <h3>批改结果</h3>
        <ul>
          <li>
            客观题：<strong>{{ gradedResult.correct }} / {{ gradedResult.total }}</strong>
            <template v-if="gradedResult.total">
              （{{ Math.round(gradedResult.score * 100) }}%）
            </template>
          </li>
          <li v-if="gradedResult.tier">综合等级：<strong>{{ gradedResult.tier }}</strong></li>
        </ul>
        <p class="nasai-quiz__note">
          主观题请对照上面的要点自评。忘记自评的题不会计入 Knowledge Score。
        </p>
        <button type="button" class="nasai-quiz__btn nasai-quiz__btn--ghost" @click="start">
          重新作答
        </button>
      </div>
    </template>

    <p v-if="!hydrated" class="nasai-quiz__note">正在载入本地进度…</p>
  </div>
</template>

<style scoped>
.nasai-quiz {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--vp-c-divider);
}

.nasai-quiz__title {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.nasai-quiz__section {
  margin-bottom: 1.75rem;
}

.nasai-quiz__note {
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
}

.nasai-quiz__last {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.nasai-quiz__recall {
  margin-bottom: 1rem;
}

.nasai-quiz__recall-stem {
  margin: 0.5rem 0 0.35rem;
  font-weight: 500;
}

.nasai-quiz__input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
}

.nasai-quiz__input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.nasai-quiz__counter {
  margin: 0.25rem 0 0;
  text-align: right;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.nasai-quiz__counter.is-over {
  color: var(--vp-c-danger-1);
}

.nasai-quiz__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
}

.nasai-quiz__progress {
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
}

.nasai-quiz__btn {
  padding: 0.45rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
}

.nasai-quiz__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.nasai-quiz__btn--ghost {
  margin-top: 0.75rem;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.nasai-quiz__result {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.nasai-quiz__result h3 {
  margin-top: 0;
}

.nasai-quiz__result ul {
  margin: 0.5rem 0 0.5rem 1rem;
  padding: 0;
}
</style>
