<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as entries } from '../../data/glossary.data.mts'

const query = ref('')
const category = ref<string>('')

const categories = computed(() =>
  [...new Set(entries.map((e) => e.category).filter(Boolean))].sort(),
)

/**
 * 用子串匹配而不是 MiniSearch：几百行数据下是瞬时的，
 * 而且对中文比任何分词器都可靠。
 */
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return entries.filter((e) => {
    if (category.value && e.category !== category.value) return false
    if (!q) return true
    return (
      e.term.toLowerCase().includes(q) ||
      e.zh.toLowerCase().includes(q) ||
      e.def.toLowerCase().includes(q)
    )
  })
})
</script>

<template>
  <div class="nasai-glossary">
    <div class="nasai-glossary__bar">
      <input
        v-model="query"
        type="search"
        class="nasai-glossary__search"
        placeholder="搜索术语、中文名或解释…"
        aria-label="搜索术语"
      />
      <div class="nasai-glossary__cats">
        <button
          type="button"
          class="nasai-glossary__cat"
          :class="{ 'is-active': category === '' }"
          @click="category = ''"
        >
          全部（{{ entries.length }}）
        </button>
        <button
          v-for="c in categories"
          :key="c"
          type="button"
          class="nasai-glossary__cat"
          :class="{ 'is-active': category === c }"
          @click="category = c"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <p v-if="!entries.length" class="nasai-glossary__empty">
      术语表还没有内容。学到新词时在
      <code>docs/glossary/glossary.md</code> 里补一行即可。
    </p>
    <p v-else-if="!filtered.length" class="nasai-glossary__empty">
      没有匹配「{{ query }}」的术语。
    </p>

    <table v-else class="nasai-glossary__table">
      <thead>
        <tr>
          <th>Term</th>
          <th>中文</th>
          <th>一句话解释</th>
          <th>分类</th>
          <th>首次出现</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in filtered" :key="e.term">
          <td><strong>{{ e.term }}</strong></td>
          <td>{{ e.zh }}</td>
          <td>{{ e.def }}</td>
          <td><span class="nasai-glossary__tag">{{ e.category }}</span></td>
          <td class="nasai-glossary__seen">{{ e.firstSeen }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="filtered.length" class="nasai-glossary__count">
      显示 {{ filtered.length }} / {{ entries.length }} 条
    </p>
  </div>
</template>

<style scoped>
.nasai-glossary__bar {
  margin-bottom: 1.25rem;
}

.nasai-glossary__search {
  width: 100%;
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.nasai-glossary__search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.nasai-glossary__cats {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
}

.nasai-glossary__cat {
  padding: 0.2rem 0.65rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
}

.nasai-glossary__cat.is-active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.nasai-glossary__table {
  width: 100%;
  display: table;
  font-size: 0.88rem;
}

.nasai-glossary__tag {
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  font-size: 0.78rem;
  white-space: nowrap;
}

.nasai-glossary__seen {
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.nasai-glossary__empty {
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  text-align: center;
}

.nasai-glossary__count {
  margin-top: 0.75rem;
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
}
</style>
