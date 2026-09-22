<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ text: string; explanation?: string }>()

const open = ref(false)
</script>

<template>
  <div class="nasai-ref">
    <button type="button" class="nasai-ref__toggle" @click="open = !open">
      {{ open ? '收起参考答案' : '展开参考答案' }}
    </button>

    <div v-if="open" class="nasai-ref__body">
      <p class="nasai-ref__label">参考答案</p>
      <p>{{ text }}</p>
      <template v-if="explanation">
        <p class="nasai-ref__label">解析</p>
        <p>{{ explanation }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.nasai-ref {
  margin-top: 0.6rem;
}

.nasai-ref__toggle {
  padding: 0.25rem 0.7rem;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  cursor: pointer;
}

.nasai-ref__toggle:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.nasai-ref__body {
  margin-top: 0.6rem;
  padding: 0.8rem 1rem;
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-radius: 0 6px 6px 0;
  font-size: 0.9rem;
}

.nasai-ref__body p {
  margin: 0.25rem 0;
}

.nasai-ref__label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}
</style>
