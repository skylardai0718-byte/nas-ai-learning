import { computed, type Ref } from 'vue'
import {
  DOMAINS,
  LEVELS,
  type AppState,
  type Domain,
  type DomainTally,
  type Level,
} from './types'

/**
 * 等级门槛与最低证据量。
 *
 * 最低证据量比阈值更重要：没有它，第一天答对 5 题就会显示 Comfortable，
 * 这与路线图「不为了让进度曲线好看而提前加分」的原则直接冲突。
 */
const THRESHOLDS: { level: Level; min: number; evidence: number }[] = [
  { level: 'Strong', min: 0.95, evidence: 25 },
  { level: 'Comfortable', min: 0.85, evidence: 15 },
  { level: 'Working Knowledge', min: 0.7, evidence: 8 },
  { level: 'Basic', min: 0.5, evidence: 3 },
  { level: 'Beginner', min: 0, evidence: 0 },
]

export interface DomainScore {
  domain: Domain
  /** null 表示该领域还没有任何答题证据 */
  accuracy: number | null
  level: Level | null
  answered: number
  /** 来自 domainOverrides 的手动设定 */
  isOverridden: boolean
  overrideNote: string
}

function levelFor(accuracy: number, answered: number): Level {
  for (const t of THRESHOLDS) {
    if (accuracy >= t.min && answered >= t.evidence) return t.level
  }
  return 'Beginner'
}

/** 只取每课最近一次作答，这样复习后重测才能提分，刷同一题不会虚高 */
function latestAttempts(state: AppState) {
  return Object.values(state.lessons)
    .map((lesson) => lesson.attempts[lesson.attempts.length - 1])
    .filter((a) => a && a.perDomain)
}

export function useScore(state: Ref<AppState>) {
  const domainScores = computed<DomainScore[]>(() => {
    const tallies: Partial<Record<Domain, DomainTally>> = {}

    for (const attempt of latestAttempts(state.value)) {
      for (const [domain, tally] of Object.entries(attempt.perDomain) as [
        Domain,
        DomainTally,
      ][]) {
        if (!tally) continue
        const current = tallies[domain] ?? { earned: 0, total: 0, count: 0 }
        current.earned += tally.earned
        current.total += tally.total
        current.count += tally.count
        tallies[domain] = current
      }
    }

    return DOMAINS.map((domain) => {
      const tally = tallies[domain]
      const override = state.value.domainOverrides[domain]

      if (!tally || tally.total === 0) {
        return {
          domain,
          accuracy: null,
          level: override ? override.level : null,
          answered: 0,
          isOverridden: Boolean(override),
          overrideNote: override?.note ?? '',
        }
      }

      const accuracy = tally.earned / tally.total
      return {
        domain,
        accuracy,
        level: override ? override.level : levelFor(accuracy, tally.count),
        answered: tally.count,
        isOverridden: Boolean(override),
        overrideNote: override?.note ?? '',
      }
    })
  })

  /** 尚未开始的领域从总分里排除：7 个领域里 5 个结构性为零，算进去总分毫无意义 */
  const started = computed(() => domainScores.value.filter((d) => d.answered > 0))

  const overallAccuracy = computed(() => {
    const list = started.value.filter((d) => d.accuracy !== null)
    if (!list.length) return null
    return list.reduce((acc, d) => acc + (d.accuracy ?? 0), 0) / list.length
  })

  const overallLevel = computed<Level | null>(() => {
    const list = started.value
    if (!list.length) return null
    const lowest = list.reduce((acc, d) => {
      const ai = LEVELS.indexOf(d.level ?? 'Beginner')
      const bi = LEVELS.indexOf(acc.level ?? 'Beginner')
      return ai < bi ? d : acc
    })
    return lowest.level
  })

  return { domainScores, overallAccuracy, overallLevel, started }
}
