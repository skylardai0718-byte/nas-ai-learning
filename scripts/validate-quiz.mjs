#!/usr/bin/env node
/**
 * 检查题库的机械性错误：这些错误会让判分静默出错，但不需要读内容就能发现。
 *
 * 它抓不出「答案键写错了」—— 那只能靠人工核对。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bankDir = join(root, 'docs', 'public', 'quiz')
const lessonsDir = join(root, 'docs', 'lessons')

const CURRENT_SCHEMA_VERSION = 1
const REQUIRED_QUESTION_TYPES = ['choice', 'truefalse', 'short', 'scenario']

const errors = []
const warnings = []

function err(file, message) {
  errors.push(`${file}: ${message}`)
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`)
}

/** 逐行读课件 frontmatter 里的 lessonId，避免为了校验引入 YAML 依赖 */
function collectLessonIds() {
  const ids = new Map()
  if (!existsSync(lessonsDir)) return ids

  for (const dir of readdirSync(lessonsDir)) {
    const dirPath = join(lessonsDir, dir)
    let files
    try {
      files = readdirSync(dirPath)
    } catch {
      continue
    }

    for (const file of files) {
      if (!file.endsWith('.md') || file === 'index.md') continue
      const text = readFileSync(join(dirPath, file), 'utf-8')
      const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (!match) {
        warn(relative(root, join(dirPath, file)), '缺少 frontmatter')
        continue
      }
      const idMatch = match[1].match(/^lessonId:\s*(\S+)/m)
      if (!idMatch) {
        warn(relative(root, join(dirPath, file)), 'frontmatter 里没有 lessonId')
        continue
      }
      ids.set(idMatch[1], relative(root, join(dirPath, file)))
    }
  }
  return ids
}

function validateQuestion(file, q, index, seenIds) {
  const label = `第 ${index + 1} 题 (${q.id ?? '无 id'})`

  if (!q.id) err(file, `${label} 缺少 id`)
  else if (seenIds.has(q.id)) err(file, `${label} 的 id 重复`)
  else seenIds.add(q.id)

  if (!q.type) err(file, `${label} 缺少 type`)
  else if (!REQUIRED_QUESTION_TYPES.includes(q.type)) {
    err(file, `${label} 的 type "${q.type}" 不是支持的题型`)
  }

  if (!q.stem) err(file, `${label} 缺少 stem`)
  if (typeof q.weight !== 'number') err(file, `${label} 缺少 weight`)

  if (q.type === 'choice') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      err(file, `${label} 的 options 至少需要两项`)
    } else {
      const keys = q.options.map((o) => o.key)
      if (new Set(keys).size !== keys.length) err(file, `${label} 的选项 key 有重复`)
      if (!keys.includes(q.answer)) {
        err(file, `${label} 的答案 "${q.answer}" 不在自己的选项里`)
      }
      for (const opt of q.options) {
        if (!opt.key || !opt.text) err(file, `${label} 有选项缺少 key 或 text`)
      }
    }
    if (!q.explanation) err(file, `${label} 缺少 explanation`)
  }

  if (q.type === 'truefalse') {
    if (typeof q.answer !== 'boolean') {
      err(file, `${label} 的答案必须是布尔值 true/false`)
    }
    if (!q.explanation) err(file, `${label} 缺少 explanation`)
  }

  if (q.type === 'short' || q.type === 'scenario') {
    if (!q.referenceAnswer) err(file, `${label} 缺少 referenceAnswer`)
    if (!Array.isArray(q.keyPoints) || q.keyPoints.length === 0) {
      err(file, `${label} 缺少 keyPoints —— 没有它就无法自评`)
    } else {
      for (const point of q.keyPoints) {
        if (!point.text) err(file, `${label} 有 keyPoint 缺少 text`)
        if (typeof point.required !== 'boolean') {
          err(file, `${label} 的 keyPoint "${point.text}" 缺少 required 布尔标记`)
        }
      }
    }
  }
}

const lessonIds = collectLessonIds()

if (!existsSync(bankDir)) {
  console.log('没有找到题库目录，跳过校验。')
  process.exit(0)
}

const bankFiles = readdirSync(bankDir).filter((f) => f.endsWith('.json'))

if (!bankFiles.length) {
  console.log('题库目录是空的，跳过校验。')
  process.exit(0)
}

for (const file of bankFiles) {
  const path = join(bankDir, file)
  let bank

  try {
    bank = JSON.parse(readFileSync(path, 'utf-8'))
  } catch (error) {
    err(file, `JSON 无法解析 —— ${error.message}`)
    continue
  }

  if (bank.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    err(file, `schemaVersion 是 ${bank.schemaVersion}，期望 ${CURRENT_SCHEMA_VERSION}`)
  }

  if (!bank.lessonId) err(file, '缺少 lessonId')
  else {
    const expected = file.replace(/\.json$/, '')
    if (bank.lessonId !== expected) {
      err(file, `lessonId "${bank.lessonId}" 与文件名不一致`)
    }
    if (lessonIds.size && !lessonIds.has(bank.lessonId)) {
      err(file, `找不到对应的课件文件（frontmatter 里没有 lessonId: ${bank.lessonId}）`)
    }
  }

  if (typeof bank.week !== 'number') err(file, '缺少 week')
  if (typeof bank.day !== 'number') err(file, '缺少 day')
  if (typeof bank.quizVersion !== 'number') err(file, '缺少 quizVersion')
  if (!Array.isArray(bank.domains) || !bank.domains.length) err(file, '缺少 domains')

  const seenIds = new Set()

  if (Array.isArray(bank.recall)) {
    for (const item of bank.recall) {
      if (!item.id) err(file, '有复述题缺少 id')
      else if (seenIds.has(item.id)) err(file, `复述题 id "${item.id}" 重复`)
      else seenIds.add(item.id)
      if (!item.stem) err(file, `复述题 ${item.id} 缺少 stem`)
    }
  }

  if (bank.summary) {
    if (!bank.summary.referenceAnswer) err(file, 'summary 缺少 referenceAnswer')
    if (!Array.isArray(bank.summary.keyPoints) || !bank.summary.keyPoints.length) {
      err(file, 'summary 缺少 keyPoints')
    }
    if (typeof bank.summary.maxChars !== 'number') err(file, 'summary 缺少 maxChars')
  }

  if (!Array.isArray(bank.questions) || bank.questions.length === 0) {
    err(file, '缺少 questions')
    continue
  }

  bank.questions.forEach((q, i) => validateQuestion(file, q, i, seenIds))

  const types = new Set(bank.questions.map((q) => q.type))
  for (const type of REQUIRED_QUESTION_TYPES) {
    if (!types.has(type)) {
      warn(file, `题目里没有 ${type} 类型的题（课程模板要求四种题型都有）`)
    }
  }
  if (bank.questions.length !== 10) {
    warn(file, `共 ${bank.questions.length} 道题，课程模板约定是 10 道`)
  }
}

for (const id of lessonIds.keys()) {
  if (!bankFiles.includes(`${id}.json`)) {
    warn(`${id}.json`, '课件还没有配套题库（学习中此提示可忽略）')
  }
}

if (warnings.length) {
  console.log('\n提醒：')
  for (const w of warnings) console.log(`  · ${w}`)
}

if (errors.length) {
  console.error('\n题库校验失败：')
  for (const e of errors) console.error(`  ✗ ${e}`)
  console.error(`\n共 ${errors.length} 个错误。`)
  process.exit(1)
}

console.log(`\n✓ 题库校验通过（${bankFiles.length} 份，${warnings.length} 条提醒）。`)
