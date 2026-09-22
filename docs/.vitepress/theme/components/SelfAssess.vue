<script setup lang="ts">
import { computed } from 'vue'
import { TIERS, type KeyPoint, type Tier } from '../composables/types'
import { suggestTier } from '../composables/useQuiz'

const props = defineProps<{
  keyPoints: KeyPoint[]
  checked: string[]
  rating: Tier | null
}>()

const emit = defineEmits<{
  (e: 'update:checked', value: string[]): void
  (e: 'update:rating', value: Tier): void
}>()

const suggestion = computed(() => suggestTier(props.checked, props.keyPoints))

function toggle(text: string) {
  const next = props.checked.includes(text)
    ? props.checked.filter((t) => t !== text)
    : [...props.checked, text]
  emit('update:checked', next)
  emit('update:rating', suggestTier(next, props.keyPoints))
}

const TIER_HINT: Record<Tier, string> = {
  完全理解: '要点齐全，能独立复述',
  基本理解: '方向正确，但漏了部分要点',
  表面理解: '记住了说法，说不清原理',
  存在误区: '核心逻辑理解反了',
}
</script>

<template>
  <div class="nasai-self">
    <p class="nasai-self__lead">
      对照要点自评。勾选你确实答到的部分，系统会给出建议等级 —— 你可以改。
    </p>

    <ul class="nasai-self__points">
      <li v-for="point in keyPoints" :key="point.text">
        <label>
          <input
            type="checkbox"
            :checked="checked.includes(point.text)"
            @change="toggle(point.text)"
          />
          <span>{{ point.text }}</span>
          <em v-if="point.required" class="nasai-self__req">必答</em>
        </label>
      </li>
    </ul>

    <div class="nasai-self__rating">
      <span class="nasai-self__label">批改等级</span>
      <div class="nasai-self__opts">
        <label
          v-for="tier in TIERS"
          :key="tier"
          class="nasai-self__opt"
          :class="{ 'nasai-self__opt--suggested': tier === suggestion }"
        >
          <input
            type="radio"
            name="tier"
            :value="tier"
            :checked="rating === tier"
            @change="emit('update:rating', tier)"
          />
          <span>{{ tier }}</span>
        </label>
      </div>
    </div>

    <p class="nasai-self__hint">
      建议：<strong>{{ suggestion }}</strong> —— {{ TIER_HINT[suggestion] }}
      <template v-if="rating && rating !== suggestion">
        （你选择了 {{ rating }}）
      </template>
    </p>
  </div>
</template>

<style scoped>
.nasai-self {
  margin-top: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.9rem;
}

.nasai-self__lead {
  margin: 0 0 0.6rem;
  color: var(--vp-c-text-2);
}

.nasai-self__points {
  margin: 0 0 0.9rem;
  padding: 0;
  list-style: none;
}

.nasai-self__points li {
  margin: 0.3rem 0;
}

.nasai-self__points label {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  cursor: pointer;
}

.nasai-self__req {
  font-size: 0.7rem;
  font-style: normal;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px;
  padding: 0 0.3rem;
}

.nasai-self__rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nasai-self__label {
  color: var(--vp-c-text-2);
}

.nasai-self__opts {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.nasai-self__opt {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  cursor: pointer;
}

.nasai-self__opt--suggested {
  border-color: var(--vp-c-brand-1);
}

.nasai-self__hint {
  margin: 0.75rem 0 0;
  color: var(--vp-c-text-2);
}
</style>
