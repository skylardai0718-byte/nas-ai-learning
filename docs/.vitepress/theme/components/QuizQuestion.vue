<script setup lang="ts">
import { computed } from 'vue'
import ReferenceAnswer from './ReferenceAnswer.vue'
import SelfAssess from './SelfAssess.vue'
import type { StoredAnswer, Tier, Question } from '../composables/types'

const props = defineProps<{
  index: number
  question: Question
  modelValue: StoredAnswer | undefined
  graded: boolean
}>()

const emit = defineEmits<{
  (e: 'update', value: StoredAnswer): void
}>()

const TYPE_LABEL: Record<Question['type'], string> = {
  choice: '选择题',
  truefalse: '判断题',
  short: '简答题',
  scenario: '场景题',
}

const isCorrect = computed(() =>
  props.modelValue?.type === 'choice' || props.modelValue?.type === 'truefalse'
    ? props.modelValue.correct
    : null,
)

function setChoice(key: string) {
  emit('update', {
    type: 'choice',
    value: key,
    correct: props.question.type === 'choice' && key === props.question.answer,
  })
}

function setTrueFalse(value: boolean) {
  const q = props.question
  emit('update', {
    type: 'truefalse',
    value,
    correct: q.type === 'truefalse' && value === q.answer,
    reason: props.modelValue?.type === 'truefalse' ? props.modelValue.reason : '',
  })
}

function setReason(reason: string) {
  const prev = props.modelValue
  if (prev?.type !== 'truefalse') return
  emit('update', { ...prev, reason })
}

function setText(text: string) {
  const q = props.question
  if (q.type !== 'short' && q.type !== 'scenario') return
  const prev = props.modelValue
  emit('update', {
    type: q.type,
    text,
    checkedKeyPoints: prev && 'checkedKeyPoints' in prev ? prev.checkedKeyPoints : [],
    rating: prev && 'rating' in prev ? prev.rating : null,
  })
}

function setChecked(checked: string[]) {
  const prev = props.modelValue
  if (!prev || (prev.type !== 'short' && prev.type !== 'scenario')) return
  emit('update', { ...prev, checkedKeyPoints: checked })
}

function setRating(rating: Tier) {
  const prev = props.modelValue
  if (!prev || (prev.type !== 'short' && prev.type !== 'scenario')) return
  emit('update', { ...prev, rating })
}

const subjectiveValue = computed(() => {
  const v = props.modelValue
  if (!v || (v.type !== 'short' && v.type !== 'scenario')) return null
  return v
})
</script>

<template>
  <article class="nasai-q" :class="{ 'nasai-q--graded': graded }">
    <header class="nasai-q__head">
      <span class="nasai-q__no">{{ index }}</span>
      <span class="nasai-q__type">{{ TYPE_LABEL[question.type] }}</span>
      <span v-if="graded && isCorrect !== null" class="nasai-q__mark">
        {{ isCorrect ? '✓ 正确' : '✗ 错误' }}
      </span>
    </header>

    <p class="nasai-q__stem">{{ question.stem }}</p>
    <p v-if="question.type === 'scenario' && question.prompt" class="nasai-q__prompt">
      {{ question.prompt }}
    </p>
    <p v-if="question.type === 'short' && question.hint" class="nasai-q__hint">
      {{ question.hint }}
    </p>

    <!-- 选择题 -->
    <div v-if="question.type === 'choice'" class="nasai-q__options">
      <label
        v-for="opt in question.options"
        :key="opt.key"
        class="nasai-q__option"
        :class="{
          'nasai-q__option--picked': modelValue?.type === 'choice' && modelValue.value === opt.key,
          'nasai-q__option--answer': graded && opt.key === question.answer,
        }"
      >
        <input
          type="radio"
          :name="question.id"
          :value="opt.key"
          :checked="modelValue?.type === 'choice' && modelValue.value === opt.key"
          :disabled="graded"
          @change="setChoice(opt.key)"
        />
        <span><strong>{{ opt.key }}.</strong> {{ opt.text }}</span>
      </label>
    </div>

    <!-- 判断题 -->
    <div v-else-if="question.type === 'truefalse'" class="nasai-q__tf">
      <div class="nasai-q__options">
        <label
          v-for="val in [true, false]"
          :key="String(val)"
          class="nasai-q__option"
          :class="{
            'nasai-q__option--picked': modelValue?.type === 'truefalse' && modelValue.value === val,
            'nasai-q__option--answer': graded && val === question.answer,
          }"
        >
          <input
            type="radio"
            :name="question.id"
            :checked="modelValue?.type === 'truefalse' && modelValue.value === val"
            :disabled="graded"
            @change="setTrueFalse(val)"
          />
          <span>{{ val ? '正确' : '错误' }}</span>
        </label>
      </div>

      <textarea
        v-if="question.requiresReason"
        class="nasai-q__input"
        rows="2"
        placeholder="用一句话说明理由"
        :value="modelValue?.type === 'truefalse' ? modelValue.reason : ''"
        :disabled="graded"
        @input="setReason(($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <!-- 简答题 / 场景题 -->
    <textarea
      v-else
      class="nasai-q__input"
      rows="4"
      placeholder="先自己作答，再看参考答案"
      :value="subjectiveValue?.text ?? ''"
      :disabled="graded"
      @input="setText(($event.target as HTMLTextAreaElement).value)"
    />

    <!-- 批改后：客观题给解析，主观题给参考答案 + 自评 -->
    <template v-if="graded">
      <p
        v-if="question.type === 'choice' && modelValue?.type === 'choice' && !modelValue.correct
          && question.distractors?.[modelValue.value]"
        class="nasai-q__distractor"
      >
        你选的 {{ modelValue.value }} 对应本课的：{{ question.distractors[modelValue.value] }}
      </p>

      <ReferenceAnswer
        v-if="question.type === 'choice' || question.type === 'truefalse'"
        :text="question.explanation"
      />

      <template v-else>
        <ReferenceAnswer :text="question.referenceAnswer" />
        <SelfAssess
          :key-points="question.keyPoints"
          :checked="subjectiveValue?.checkedKeyPoints ?? []"
          :rating="subjectiveValue?.rating ?? null"
          @update:checked="setChecked"
          @update:rating="setRating"
        />
      </template>
    </template>
  </article>
</template>

<style scoped>
.nasai-q {
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nasai-q:last-child {
  border-bottom: none;
}

.nasai-q__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.nasai-q__no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.78rem;
}

.nasai-q__type {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 0 0.4rem;
}

.nasai-q__mark {
  margin-left: auto;
  font-size: 0.82rem;
  font-weight: 600;
}

.nasai-q__stem {
  margin: 0 0 0.5rem;
  font-weight: 500;
}

.nasai-q__prompt,
.nasai-q__hint {
  margin: 0 0 0.6rem;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
}

.nasai-q__options {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.nasai-q__option {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.nasai-q__option--picked {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.nasai-q__option--answer {
  border-color: var(--vp-c-green-1);
  background: var(--vp-c-green-soft);
}

.nasai-q__input {
  width: 100%;
  margin-top: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
}

.nasai-q__input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.nasai-q__distractor {
  margin: 0.6rem 0 0;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: var(--vp-c-warning-soft);
  font-size: 0.86rem;
}
</style>
