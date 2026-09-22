<script setup lang="ts">
import { computed } from 'vue'
import { data as lessons } from '../../data/lessons.data.mts'
import { useProgress } from '../composables/useProgress'

const { state, hydrated } = useProgress()

const lessonLinks = computed(() =>
  Object.fromEntries(lessons.map((l) => [l.lessonId, l.link])),
)

const STATUS_LABEL = { red: '🔴 不理解', yellow: '🟡 模糊', green: '🟢 已掌握' } as const

const sorted = computed(() =>
  [...state.value.reviewQueue].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  ),
)

/** 到今天为止该复测的 */
const due = computed(() => {
  const now = Date.now()
  return sorted.value.filter((i) => new Date(i.dueAt).getTime() <= now)
})

function dueLabel(iso: string) {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (days <= 0) return '今天该复测'
  return `${days} 天后复测`
}
</script>

<template>
  <div class="nasai-review">
    <p v-if="!hydrated" class="nasai-review__empty">正在载入进度…</p>

    <template v-else-if="!sorted.length">
      <p class="nasai-review__empty">
        暂无待复测的题目。答错的题和自评不理想的题会自动进入这里。
      </p>
    </template>

    <template v-else>
      <p class="nasai-review__summary">
        共 {{ sorted.length }} 题待复测，其中 <strong>{{ due.length }}</strong> 题已到期。
      </p>

      <ul class="nasai-review__list">
        <li v-for="item in sorted" :key="`${item.lessonId}-${item.questionId}`">
          <span class="nasai-review__status">{{ STATUS_LABEL[item.status] }}</span>
          <a
            v-if="lessonLinks[item.lessonId]"
            :href="lessonLinks[item.lessonId]"
            class="nasai-review__stem"
          >
            {{ item.stem || item.questionId }}
          </a>
          <span v-else class="nasai-review__stem">{{ item.stem || item.questionId }}</span>
          <span class="nasai-review__due" :class="{ 'is-due': dueLabel(item.dueAt) === '今天该复测' }">
            {{ dueLabel(item.dueAt) }}
          </span>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.nasai-review__empty {
  padding: 1.25rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.nasai-review__summary {
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.nasai-review__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nasai-review__list li {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.88rem;
}

.nasai-review__status {
  white-space: nowrap;
  font-size: 0.8rem;
}

.nasai-review__stem {
  flex: 1;
}

.nasai-review__due {
  white-space: nowrap;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.nasai-review__due.is-due {
  color: var(--vp-c-warning-1);
  font-weight: 600;
}
</style>
