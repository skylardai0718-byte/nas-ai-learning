<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as lessons } from '../../data/lessons.data.mts'
import { useProgress } from '../composables/useProgress'

const { state, hydrated } = useProgress()

const nextLesson = computed(() => {
  if (!lessons.length) return null
  const done = state.value.lessons
  // 已读但未完成的优先；否则第一课未读的
  const inProgress = lessons.find(
    (l) => done[l.lessonId]?.visitedAt && !done[l.lessonId]?.completedAt,
  )
  if (inProgress) return { lesson: inProgress, reason: '继续上次' }

  const untouched = lessons.find((l) => !done[l.lessonId]?.visitedAt)
  if (untouched) return { lesson: untouched, reason: '从下一课开始' }

  return null
})

const allDone = computed(
  () =>
    lessons.length > 0 &&
    lessons.every((l) => state.value.lessons[l.lessonId]?.completedAt),
)
</script>

<template>
  <div v-if="hydrated && lessons.length" class="nasai-continue">
    <template v-if="nextLesson">
      <span class="nasai-continue__tag">{{ nextLesson.reason }}</span>
      <a :href="withBase(nextLesson.lesson.link)" class="nasai-continue__link">
        Week {{ nextLesson.lesson.week }} · Day {{ nextLesson.lesson.day }} —
        {{ nextLesson.lesson.title }}
      </a>
    </template>
    <template v-else-if="allDone">
      <span class="nasai-continue__tag">已全部完成</span>
      <span class="nasai-continue__link">12 周课程全部标记完成，可以去看看待复测题目。</span>
    </template>
  </div>
</template>

<style scoped>
.nasai-continue {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.85rem 1.1rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.nasai-continue__tag {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.78rem;
  white-space: nowrap;
}

.nasai-continue__link {
  font-weight: 500;
}
</style>
