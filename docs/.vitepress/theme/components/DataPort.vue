<script setup lang="ts">
import { ref } from 'vue'
import { useProgress } from '../composables/useProgress'
import type { AppState } from '../composables/types'

const { state, hydrated, storageAvailable, replaceState, reset } = useProgress()

const fileInput = ref<HTMLInputElement | null>(null)
const message = ref('')
const confirmingReset = ref(false)

/**
 * localStorage 按浏览器 + 按来源隔离，而且会被浏览器清理。
 * 这是 12 周记录不丢的唯一保障。
 */
function exportData() {
  const blob = new Blob([JSON.stringify(state.value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `nas-ai-progress-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
  message.value = '已导出进度文件。请自行保存到安全位置。'
}

function pickFile() {
  fileInput.value?.click()
}

async function importData(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const parsed = JSON.parse(await file.text()) as AppState
    if (typeof parsed.schemaVersion !== 'number' || !parsed.lessons) {
      throw new Error('文件结构不符合预期')
    }
    replaceState(parsed)
    message.value = `已导入：${Object.keys(parsed.lessons).length} 课的学习记录。`
  } catch (error) {
    message.value = `导入失败：${error instanceof Error ? error.message : '文件无法解析'}`
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

function doReset() {
  reset()
  confirmingReset.value = false
  message.value = '已清空本地进度。'
}
</script>

<template>
  <div class="nasai-port">
    <p v-if="!hydrated" class="nasai-port__note">正在载入进度…</p>

    <template v-else>
      <p v-if="!storageAvailable" class="nasai-port__warn">
        浏览器拒绝了本地存储（可能是无痕模式）。本次学习进度不会被保存，
        建议先导出备份，或换一个普通窗口。
      </p>

      <p class="nasai-port__note">
        进度保存在这台电脑的这个浏览器里。换电脑、换浏览器或清理浏览器数据都会丢失，
        所以建议定期导出。
      </p>

      <div class="nasai-port__actions">
        <button type="button" class="nasai-port__btn" @click="exportData">
          导出进度
        </button>
        <button type="button" class="nasai-port__btn" @click="pickFile">
          导入进度
        </button>
        <button
          v-if="!confirmingReset"
          type="button"
          class="nasai-port__btn nasai-port__btn--danger"
          @click="confirmingReset = true"
        >
          清空进度
        </button>
        <template v-else>
          <button
            type="button"
            class="nasai-port__btn nasai-port__btn--danger"
            @click="doReset"
          >
            确认清空
          </button>
          <button
            type="button"
            class="nasai-port__btn nasai-port__btn--ghost"
            @click="confirmingReset = false"
          >
            取消
          </button>
        </template>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="application/json"
        class="nasai-port__file"
        @change="importData"
      />

      <p v-if="message" class="nasai-port__message">{{ message }}</p>
    </template>
  </div>
</template>

<style scoped>
.nasai-port__note {
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
}

.nasai-port__warn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-warning-soft);
  font-size: 0.88rem;
}

.nasai-port__actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}

.nasai-port__btn {
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.86rem;
  cursor: pointer;
}

.nasai-port__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.nasai-port__btn--danger:hover {
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
}

.nasai-port__btn--ghost {
  border-style: dashed;
}

.nasai-port__file {
  display: none;
}

.nasai-port__message {
  margin-top: 0.75rem;
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
}
</style>
