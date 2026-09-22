<script setup lang="ts">
import { computed } from 'vue'
import { data as lessons } from '../../data/lessons.data.mts'
import { useProgress } from '../composables/useProgress'
import { useScore } from '../composables/useScore'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const { state, hydrated } = useProgress()
const { overallLevel } = useScore(state)

const total = computed(() => lessons.length)
const readCount = computed(
  () => Object.values(state.value.lessons).filter((l) => l.visitedAt).length,
)
const doneCount = computed(
  () => Object.values(state.value.lessons).filter((l) => l.completedAt).length,
)
const testedCount = computed(
  () => Object.values(state.value.lessons).filter((l) => l.attempts.length).length,
)
const pendingReview = computed(() => state.value.reviewQueue.length)
</script>

<template>
  <div class="nasai-overview" :class="{ 'nasai-overview--compact': compact }">
    <div v-if="!hydrated" class="nasai-overview__skeleton">正在载入进度…</div>

    <div v-else class="nasai-overview__grid">
      <div class="nasai-overview__stat">
        <span class="nasai-overview__num">{{ readCount }}<small>/{{ total }}</small></span>
        <span class="nasai-overview__label">已读课程</span>
      </div>
      <div class="nasai-overview__stat">
        <span class="nasai-overview__num">{{ doneCount }}<small>/{{ total }}</small></span>
        <span class="nasai-overview__label">已标记完成</span>
      </div>
      <div class="nasai-overview__stat">
        <span class="nasai-overview__num">{{ testedCount }}</span>
        <span class="nasai-overview__label">已完成答题</span>
      </div>
      <div class="nasai-overview__stat">
        <span class="nasai-overview__num" :class="{ 'is-warn': pendingReview > 0 }">
          {{ pendingReview }}
        </span>
        <span class="nasai-overview__label">待复测题目</span>
      </div>
    </div>

    <p v-if="hydrated && overallLevel" class="nasai-overview__level">
      当前综合等级：<strong>{{ overallLevel }}</strong>
      <span class="nasai-overview__hint">（取各已开始领域中的最低等级）</span>
    </p>
    <p v-else-if="hydrated" class="nasai-overview__hint">
      还没有答题记录。完成任意一课底部的测试后，这里会显示进度。
    </p>
  </div>
</template>

<style scoped>
.nasai-overview__skeleton {
  padding: 1.5rem;
  color: var(--vp-c-text-2);
}

.nasai-overview__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.nasai-overview__stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.nasai-overview__num {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.1;
}

.nasai-overview__num small {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.nasai-overview__num.is-warn {
  color: var(--vp-c-warning-1);
}

.nasai-overview__label {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}

.nasai-overview__level {
  margin-top: 1rem;
}

.nasai-overview__hint {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}
</style>
