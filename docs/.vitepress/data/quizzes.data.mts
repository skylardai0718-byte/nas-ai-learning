import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

export interface QuizMeta {
  lessonId: string
  week: number
  day: number
  title: string
  questionCount: number
  recallCount: number
  domains: string[]
}

const dataDir = dirname(fileURLToPath(import.meta.url))

/**
 * 只暴露元数据，题目和答案一个都不进客户端 bundle。
 * 唯一真相来源是 docs/public/quiz/lesson-NN.json，这里从它派生。
 */
function collect(): QuizMeta[] {
  const bankDir = join(dataDir, '..', '..', 'public', 'quiz')
  let files: string[]
  try {
    files = readdirSync(bankDir).filter((f) => f.endsWith('.json'))
  } catch {
    return []
  }

  const metas: QuizMeta[] = []
  for (const file of files) {
    try {
      const bank = JSON.parse(readFileSync(join(bankDir, file), 'utf-8'))
      metas.push({
        lessonId: bank.lessonId,
        week: bank.week,
        day: bank.day,
        title: bank.title,
        questionCount: bank.questions?.length ?? 0,
        recallCount: bank.recall?.length ?? 0,
        domains: bank.domains ?? [],
      })
    } catch (error) {
      console.warn(`[quizzes] 跳过无法解析的题库 ${file}:`, error)
    }
  }

  return metas.sort((a, b) => a.week - b.week || a.day - b.day)
}

export default {
  watch: ['../../public/quiz/*.json'],
  load: collect,
}
