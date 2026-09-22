import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import type { DefaultTheme } from 'vitepress'

export interface LessonMeta {
  lessonId: string
  week: number
  day: number
  title: string
  weekTitle: string
  domains: string[]
  concepts: string[]
  link: string
}

const WEEK_TITLES: Record<number, string> = {
  1: '计算机地图与 NAS 基础',
  2: '读懂 NAS 硬件规格',
  3: '存储系统与数据保护',
  4: '家庭网络的基本地图',
  5: '端口、NAT 与安全远程访问',
  6: 'Self-hosting 够用的 Linux',
  7: '真正理解 Docker 的核心对象',
  8: 'Docker Compose 与部署阅读',
  9: 'Self-hosted 服务、VM 与 Docker',
  10: 'AI、LLM 与推理基础',
  11: 'AI Hardware 与 Local AI 软件栈',
  12: 'AI Agent、RAG 与 NAS + AI',
}

/**
 * 扫描 docs/lessons/**，从 frontmatter 读取课件元数据。
 * 新增课件只需写文件，不需要改任何配置。
 */
export function collectLessons(lessonsRoot: string): LessonMeta[] {
  let weekDirs: string[]
  try {
    weekDirs = readdirSync(lessonsRoot)
  } catch {
    return []
  }

  const lessons: LessonMeta[] = []
  for (const dir of weekDirs) {
    const dirPath = join(lessonsRoot, dir)
    if (!statSync(dirPath).isDirectory()) continue

    for (const file of readdirSync(dirPath)) {
      if (!file.endsWith('.md') || file === 'index.md') continue

      const { data } = matter(readFileSync(join(dirPath, file), 'utf-8'))
      if (!data.lessonId) continue

      lessons.push({
        lessonId: data.lessonId,
        week: data.week,
        day: data.day,
        title: data.title ?? file,
        weekTitle: data.weekTitle ?? WEEK_TITLES[data.week] ?? '',
        domains: data.domains ?? [],
        concepts: data.concepts ?? [],
        link: `/lessons/${dir}/${file.replace(/\.md$/, '')}`,
      })
    }
  }

  return lessons.sort((a, b) => a.week - b.week || a.day - b.day)
}

export function buildSidebar(lessonsRoot: string): DefaultTheme.SidebarItem[] {
  const lessons = collectLessons(lessonsRoot)
  const weeks = [...new Set(lessons.map((l) => l.week))].sort((a, b) => a - b)

  const weekItems: DefaultTheme.SidebarItem[] = weeks.map((week) => {
    const inWeek = lessons.filter((l) => l.week === week)
    const title = inWeek[0]?.weekTitle || WEEK_TITLES[week] || ''
    return {
      text: `Week ${week}${title ? ` · ${title}` : ''}`,
      collapsed: week > 1,
      items: [
        { text: '本周计划', link: `/roadmap/week-${String(week).padStart(2, '0')}` },
        ...inWeek.map((l) => ({
          text: `Day ${l.day} · ${l.title}`,
          link: l.link,
        })),
      ],
    }
  })

  return [
    {
      text: '开始',
      items: [
        { text: '学习地图', link: '/roadmap/' },
        { text: '进度面板', link: '/dashboard/' },
        { text: '术语表', link: '/glossary/' },
      ],
    },
    ...weekItems,
  ]
}
