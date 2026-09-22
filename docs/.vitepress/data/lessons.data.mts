import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { collectLessons, type LessonMeta } from '../sidebar.mts'

export type { LessonMeta }

const lessonsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'lessons')

export default {
  watch: ['../lessons/**/*.md'],
  load(): LessonMeta[] {
    return collectLessons(lessonsRoot)
  },
}
