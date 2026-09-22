import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vitepress'
import { buildSidebar } from './sidebar.mts'

const here = dirname(fileURLToPath(import.meta.url))
const docsRoot = join(here, '..')
const lessonsRoot = join(docsRoot, 'lessons')

const SITE_BASE = '/nas-ai-learning/'

/** CJK 统一表意文字：中日韩兼容表意文字 + 基本区 + 兼容汉字 */
const CJK_RANGE = '\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff'
const CJK_CHARS = new RegExp(`[${CJK_RANGE}]`)
const CJK_SPLIT = new RegExp(`([${CJK_RANGE}]+)`)

/**
 * 中文分词：CJK 片段切成单字 + 相邻双字，非 CJK 片段按常规规则切词。
 *
 * 为什么需要它：MiniSearch 默认按空白和标点分词，中文没有空格，整段会被当成
 * 一个词，导致只在段首或标点旁边的字能被搜到。
 *
 * 注意：这个函数必须同时传给 miniSearch.options.tokenize（建索引）
 * 和 miniSearch.searchOptions.tokenize（查询）。只设前者的话，任何两个汉字
 * 以上的查询都会静默返回空结果，且不会报任何错。
 */
function tokenizeZh(text: string): string[] {
  if (typeof text !== 'string') return []

  const out: string[] = []
  for (const part of text.toLowerCase().split(CJK_SPLIT)) {
    if (!part) continue

    if (CJK_CHARS.test(part)) {
      for (let i = 0; i < part.length; i++) out.push(part[i])
      for (let i = 0; i < part.length - 1; i++) out.push(part.slice(i, i + 2))
    } else {
      for (const word of part.split(/[^\p{L}\p{N}]+/u)) {
        if (word) out.push(word)
      }
    }
  }
  return out
}

export default defineConfig({
  // 站点根目录由 `vitepress dev docs` 指定，因此 private-notes/（在 docs/ 之外）
  // 在物理上就不可达，不需要任何排除规则。
  srcExclude: [
    '**/README.md',
    // 术语表的原始 Markdown 表格：保留给 GitHub 阅读，不单独成一个路由
    'glossary/glossary.md',
    // dist/ 和 cache/ 在 docs/ 内部，不排除的话：dev 服务器会把构建产物
    // 当成课件文件，每次跑构建都触发一轮页面重载。
    '.vitepress/dist/**',
    '.vitepress/cache/**',
  ],

  base: process.env.NODE_ENV === 'production' ? SITE_BASE : '/',
  site: 'https://skylardai0718-byte.github.io',
  title: 'NAS & AI 学习笔记',
  description: '面向零基础学习者的 12 周 NAS、Self-hosting 与本地 AI 课程',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,

  sitemap: { hostname: `https://skylardai0718-byte.github.io${SITE_BASE}` },

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  themeConfig: {
    outline: { level: [2, 3], label: '本页目录' },
    nav: [
      { text: '学习地图', link: '/roadmap/' },
      { text: '进度面板', link: '/dashboard/' },
      { text: '术语表', link: '/glossary/' },
    ],
    sidebar: buildSidebar(lessonsRoot),

    docFooter: { prev: '上一课', next: '下一课' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    lastUpdatedText: '最后更新',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '返回',
                noResultsText: '没有找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
        miniSearch: {
          options: {
            tokenize: tokenizeZh,
          },
          searchOptions: {
            tokenize: tokenizeZh,
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 },
          },
        },
      },
    },
  },
})
