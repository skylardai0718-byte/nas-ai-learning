<script setup lang="ts">
import { useProgress } from '../composables/useProgress'
import { useScore } from '../composables/useScore'
import { LEVELS } from '../composables/types'

const { state, hydrated, clearDomainOverride } = useProgress()
const { domainScores } = useScore(state)
</script>

<template>
  <div class="nasai-domains">
    <div v-if="!hydrated" class="nasai-domains__skeleton">正在载入进度…</div>

    <template v-else>
      <div v-for="d in domainScores" :key="d.domain" class="nasai-domains__row">
        <div class="nasai-domains__head">
          <span class="nasai-domains__name">{{ d.domain }}</span>
          <span class="nasai-domains__level">
            <template v-if="d.level">
              {{ d.level }}
              <em v-if="d.isOverridden" class="nasai-domains__badge">手动设定</em>
            </template>
            <template v-else>Beginner<small>（尚未开始）</small></template>
          </span>
        </div>

        <div class="nasai-domains__bar" :title="d.accuracy !== null ? `正确率 ${Math.round(d.accuracy * 100)}%` : '尚无答题证据'">
          <span
            v-for="(level, i) in LEVELS"
            :key="level"
            class="nasai-domains__seg"
            :class="{
              'is-filled': d.level !== null && i <= LEVELS.indexOf(d.level),
              'is-unknown': d.level === null,
            }"
          />
        </div>

        <div class="nasai-domains__meta">
          <template v-if="d.answered">
            已答 {{ d.answered }} 题
            <template v-if="d.accuracy !== null">
              · 正确率 {{ Math.round(d.accuracy * 100) }}%
            </template>
          </template>
          <template v-else>还没有任何答题证据</template>

          <button
            v-if="d.isOverridden"
            type="button"
            class="nasai-domains__revert"
            @click="clearDomainOverride(d.domain)"
          >
            还原为自动计算
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.nasai-domains__skeleton {
  padding: 1.5rem;
  color: var(--vp-c-text-2);
}

.nasai-domains__row {
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nasai-domains__row:last-child {
  border-bottom: none;
}

.nasai-domains__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.4rem;
}

.nasai-domains__name {
  font-weight: 600;
}

.nasai-domains__level {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
}

.nasai-domains__badge {
  margin-left: 0.4rem;
  padding: 0 0.35rem;
  border-radius: 4px;
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
  font-size: 0.72rem;
  font-style: normal;
}

.nasai-domains__bar {
  display: flex;
  gap: 3px;
}

.nasai-domains__seg {
  flex: 1;
  height: 7px;
  border-radius: 2px;
  background: var(--vp-c-default-soft);
}

.nasai-domains__seg.is-filled {
  background: var(--vp-c-brand-1);
}

.nasai-domains__seg.is-unknown {
  background: var(--vp-c-divider);
}

.nasai-domains__meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.nasai-domains__revert {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 0.78rem;
  cursor: pointer;
  text-decoration: underline;
}
</style>
