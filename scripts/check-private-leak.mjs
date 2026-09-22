#!/usr/bin/env node
/**
 * 构建产物里不该出现任何私人笔记的痕迹。
 *
 * VitePress 的构建根目录是 docs/，private-notes/ 在它外面，物理上就不可达 ——
 * 这个脚本是第二道防线，防止将来有人把 private-notes 挪进 docs/ 而没人发现。
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'docs', '.vitepress', 'dist')

/**
 * 只挑私人笔记里独有、正常课程内容里不会出现的字符串。
 * 不要用 "private-notes" 这种路径名当标记 —— 课程正文里会合法地提到它，
 * 那样只会制造误报，最后大家都学会忽略这个检查。
 */
const MARKERS = [
  '仅保存在本地，不进入公开 GitHub',
  'Personal learning records: keep local and never publish',
  '# 错题记录',
  '# 学习日志',
  '复测结果：',
]

if (!existsSync(distDir)) {
  console.error(`找不到构建产物：${relative(root, distDir)}`)
  console.error('请先运行 npm run docs:build。')
  process.exit(1)
}

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) out.push(...walk(path))
    else out.push(path)
  }
  return out
}

const files = walk(distDir)
const hits = []

for (const file of files) {
  if (!/\.(html|js|json|md|txt|xml)$/.test(file)) continue

  let text
  try {
    text = readFileSync(file, 'utf-8')
  } catch {
    continue
  }

  for (const marker of MARKERS) {
    if (text.includes(marker)) {
      hits.push({ file: relative(distDir, file), marker })
    }
  }
}

if (hits.length) {
  console.error('\n构建产物里发现了私人笔记的痕迹：')
  for (const hit of hits) {
    console.error(`  ✗ ${hit.file} 命中「${hit.marker}」`)
  }
  console.error('\n请确认 private-notes/ 仍然位于 docs/ 之外。')
  process.exit(1)
}

console.log(`✓ 已扫描 ${files.length} 个构建文件，没有私人笔记泄漏。`)
