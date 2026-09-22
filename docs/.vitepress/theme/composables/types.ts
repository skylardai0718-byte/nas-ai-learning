export const DOMAINS = [
  'Hardware',
  'Storage',
  'Network',
  'Linux',
  'Docker',
  'Self-hosting',
  'AI',
] as const

export type Domain = (typeof DOMAINS)[number]

export const LEVELS = [
  'Beginner',
  'Basic',
  'Working Knowledge',
  'Comfortable',
  'Strong',
] as const

export type Level = (typeof LEVELS)[number]

/** 批改等级，沿用课程原有的四级标准 */
export const TIERS = ['完全理解', '基本理解', '表面理解', '存在误区'] as const

export type Tier = (typeof TIERS)[number]

/** 错题本状态，与 private-notes/mistakes.md 的词汇一致 */
export type MistakeStatus = 'red' | 'yellow' | 'green'

export type QuestionType = 'choice' | 'truefalse' | 'short' | 'scenario'

export interface KeyPoint {
  text: string
  required: boolean
}

export interface ChoiceOption {
  key: string
  text: string
}

export interface BaseQuestion {
  id: string
  type: QuestionType
  stem: string
  domains?: Domain[]
  weight: number
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice'
  options: ChoiceOption[]
  answer: string
  explanation: string
  distractors?: Record<string, string>
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'truefalse'
  answer: boolean
  requiresReason?: boolean
  explanation: string
}

export interface SubjectiveQuestion extends BaseQuestion {
  type: 'short' | 'scenario'
  prompt?: string
  hint?: string
  referenceAnswer: string
  keyPoints: KeyPoint[]
}

export type Question = ChoiceQuestion | TrueFalseQuestion | SubjectiveQuestion

export interface RecallQuestion {
  id: string
  stem: string
}

export interface SummaryBlock {
  id: string
  stem: string
  maxChars: number
  referenceAnswer: string
  keyPoints: KeyPoint[]
}

export interface QuizBank {
  schemaVersion: number
  lessonId: string
  week: number
  day: number
  title: string
  quizVersion: number
  domains: Domain[]
  recall: RecallQuestion[]
  summary?: SummaryBlock
  questions: Question[]
}

/* ---------- 作答记录 ---------- */

export interface ChoiceAnswer {
  type: 'choice'
  value: string
  correct: boolean
}

export interface TrueFalseAnswer {
  type: 'truefalse'
  value: boolean
  correct: boolean
  reason: string
}

export interface SubjectiveAnswer {
  type: 'short' | 'scenario' | 'summary' | 'recall'
  text: string
  checkedKeyPoints: string[]
  rating: Tier | null
}

export type StoredAnswer = ChoiceAnswer | TrueFalseAnswer | SubjectiveAnswer

/**
 * 按领域汇总的答题战绩，在提交时一次算好存下来。
 * 这样算 Knowledge Score 时不必回头去 fetch 每一份题库，
 * 也不必把 domains/weight 冗余到每一条作答记录里。
 */
export interface DomainTally {
  earned: number
  total: number
  count: number
}

export interface QuizAttempt {
  at: string
  lessonId: string
  autoScore: number
  totalAuto: number
  selfScore: number | null
  tier: Tier | null
  answers: Record<string, StoredAnswer>
  perDomain: Partial<Record<Domain, DomainTally>>
}

export interface LessonRecord {
  visitedAt: string | null
  completedAt: string | null
  attempts: QuizAttempt[]
  latestTier: Tier | null
}

export interface ReviewItem {
  lessonId: string
  lessonTitle: string
  questionId: string
  stem: string
  status: MistakeStatus
  dueAt: string
}

export interface DomainOverride {
  level: Level
  note: string
  at: string
}

export interface AppState {
  schemaVersion: number
  createdAt: string
  updatedAt: string
  lessons: Record<string, LessonRecord>
  reviewQueue: ReviewItem[]
  domainOverrides: Partial<Record<Domain, DomainOverride>>
  settings: {
    showAnswersImmediately: boolean
  }
}

export const CURRENT_SCHEMA_VERSION = 1
