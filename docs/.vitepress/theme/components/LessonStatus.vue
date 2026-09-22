<script setup lang="ts">
import { computed, watch } from 'vue'
import { useProgress } from '../composables/useProgress'

const props = defineProps<{ lessonId: string }>()

const { state, hydrated, markVisited, setCompleted } = useProgress()

watch(
  [hydrated, () => props.lessonId],
  ([ready, id]) => {
    if (ready && id) markVisited(id)
  },
  { immediate: true },
)

const record = computed(() => state.value.lessons[props.lessonId])
const isDone = computed(() => Boolean(record.value?.completedAt))
const lastTier = computed(() => record.value?.latestTier ?? null)
const attemptCount = computed(() => record.value?.attempts.length ?? 0)
</script>

<template>
  <div v-if="hydrated" class="nasai-status">
    <span v-if="isDone" class="nasai-status__pill nasai-status__pill--done">
      ✓ 已标记完成
    </span>
    <span v-else class="nasai-status__pill">学习中</span>

    <span v-if="attemptCount" class="nasai-status__meta">
      已作答 {{ attemptCount }} 次<template v-if="lastTier">
        · 最近等级 {{ lastTier }}</template
      >
    </span>

    <button
      type="button"
      class="nasai-status__btn"
      @click="setCompleted(lessonId, !isDone)"
    >
      {{ isDone ? '取消完成标记' : '标记本课完成' }}
    </button>
  </div>
</template>

<style scoped>
.nasai-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: -0.5rem 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
}

.nasai-status__pill {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.nasai-status__pill--done {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.nasai-status__meta {
  color: var(--vp-c-text-3);
}

.nasai-status__btn {
  margin-left: auto;
  padding: 0.2rem 0.7rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
}

.nasai-status__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
