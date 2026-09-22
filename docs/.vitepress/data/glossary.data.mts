import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

export interface GlossaryEntry {
  term: string
  zh: string
  def: string
  category: string
  firstSeen: string
}

const glossaryFile = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'glossary',
  'glossary.md',
)

/**
 * 解析 glossary.md 里的 Markdown 表格。
 * 那份表格就是唯一真相来源 —— 它同时是 GitHub 上可直接阅读的文件，
 * 所以可筛选界面和可读文件永远不会分叉。
 */
function parse(): GlossaryEntry[] {
  let text: string
  try {
    text = readFileSync(glossaryFile, 'utf-8')
  } catch {
    return []
  }

  const rows: GlossaryEntry[] = []
  for (const line of text.split('\n')) {
    if (!line.trim().startsWith('|')) continue

    const cells = line.split('|').map((c) => c.trim())
    // split('|') 在首尾各产生一个空串：['', Term, 中文, 一句话解释, 分类, 首次出现, '']
    const [, term, zh, def, category, firstSeen] = cells
    if (!term || term === 'Term' || /^-+$/.test(term)) continue

    rows.push({ term, zh, def, category, firstSeen })
  }

  return rows.sort((a, b) => a.term.localeCompare(b.term))
}

export default {
  watch: ['../../glossary/glossary.md'],
  load: parse,
}
