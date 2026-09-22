import { ref } from 'vue'
import { withBase } from 'vitepress'
import type { QuizBank, StoredAnswer, Tier } from './types'

/**
 * 题库缓存。答案是按需 fetch 的：学习者点「开始答题」之前，答案不会进入页面。
 *
 * 注意用 withBase()：生产环境站点在 /nas-ai-learning/ 子路径下，
 * 写死 '/quiz/...' 会在本地开发正常、部署后必然 404。
 */
const cache = new Map<string, QuizBank>()

export async function loadQuiz(lessonId: string): Promise<QuizBank | null> {
  if (cache.has(lessonId)) return cache.get(lessonId)!

  try {
    const response = await fetch(withBase(`/quiz/${lessonId}.json`))
    if (!response.ok) return null

    const bank = (await response.json()) as QuizBank
    cache.set(lessonId, bank)
    return bank
  } catch {
    return null
  }
}

/** 自评等级 → 得分系数 */
export const TIER_SCORE: Record<Tier, number> = {
  完全理解: 1,
  基本理解: 0.75,
  表面理解: 0.4,
  存在误区: 0,
}

/** 自评等级 → 错题本状态（与 private-notes/mistakes.md 的词汇一致） */
export const TIER_STATUS = {
  完全理解: 'green',
  基本理解: 'yellow',
  表面理解: 'yellow',
  存在误区: 'red',
} as const

/**
 * 根据勾选的要点建议一个批改等级。
 * 把开放题变成有界清单，是自评能可靠的前提。
 */
export function suggestTier(
  checked: string[],
  keyPoints: { text: string; required: boolean }[],
): Tier {
  const required = keyPoints.filter((p) => p.required)
  const optional = keyPoints.filter((p) => !p.required)

  const hitRequired = required.filter((p) => checked.includes(p.text)).length
  const hitOptional = optional.filter((p) => checked.includes(p.text)).length

  if (required.length === 0) {
    return optional.length && hitOptional === optional.length ? '完全理解' : '基本理解'
  }

  if (hitRequired === required.length) {
    return hitOptional === optional.length ? '完全理解' : '基本理解'
  }
  if (hitRequired >= Math.ceil(required.length * 0.6)) return '基本理解'
  if (hitRequired > 0) return '表面理解'
  return '存在误区'
}

export function isObjective(answer: StoredAnswer): boolean {
  return answer.type === 'choice' || answer.type === 'truefalse'
}

export function answerScore(answer: StoredAnswer): number | null {
  if (answer.type === 'choice') return answer.correct ? 1 : 0
  if (answer.type === 'truefalse') return answer.correct ? 1 : 0
  return answer.rating ? TIER_SCORE[answer.rating] : null
}

/** 客观题正确率 */
export function autoScoreOf(answers: Record<string, StoredAnswer>) {
  const objective = Object.values(answers).filter(isObjective)
  const correct = objective.filter((a) => answerScore(a) === 1).length
  return {
    score: objective.length ? correct / objective.length : 0,
    total: objective.length,
    correct,
  }
}

/** 主观题自评平均分 */
export function selfScoreOf(answers: Record<string, StoredAnswer>): number | null {
  const subjective = Object.values(answers).filter((a) => !isObjective(a))
  const rated = subjective.filter((a) => 'rating' in a && a.rating)
  if (!rated.length) return null
  const sum = rated.reduce((acc, a) => acc + (TIER_SCORE[(a as never)['rating']] ?? 0), 0)
  return sum / rated.length
}

/** 综合等级：客观题与自评都算上 */
export function overallTier(answers: Record<string, StoredAnswer>): Tier | null {
  const scores = Object.values(answers)
    .map(answerScore)
    .filter((s): s is number => s !== null)

  if (!scores.length) return null
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length

  if (avg >= 0.95) return '完全理解'
  if (avg >= 0.7) return '基本理解'
  if (avg >= 0.4) return '表面理解'
  return '存在误区'
}
