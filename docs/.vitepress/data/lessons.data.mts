import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { collectLessons, type LessonMeta } from '../sidebar.mts'

export type { LessonMeta }

// 本文件在 docs/.vitepress/data/ 下，课件在 docs/lessons/，所以要回退两级。
// config.mts 在 docs/.vitepress/ 下、只需回退一级，别照抄那处的写法。
const lessonsRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'lessons',
)

export default {
  watch: ['../lessons/**/*.md'],
  load(): LessonMeta[] {
    return collectLessons(lessonsRoot)
  },
}
