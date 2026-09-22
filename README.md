# NAS & AI Learning

> A humanities graduate learning NAS, self-hosting, and AI hardware from scratch.

这是一个面向非计算机专业学习者的 12 周实践型学习仓库。目标不是成为工程师，而是建立一套足以看懂 NAS 规格、理解家庭网络、部署基础自托管服务，并判断本地 AI 硬件需求的知识体系。

## 学习方法

- 从直觉和实际场景开始，再补充准确的技术解释。
- 每课只引入 3–5 个核心概念。
- 用 NAS、Homelab、Jellyfin、Immich、Pi-hole、Tailscale 与 Local AI 场景串联知识。
- 每课都包含复述与测试；先作答，再批改。
- 每周回顾薄弱点，并把适合公开的学习成果整理进仓库。

## 从这里开始

1. [12 周学习地图](docs/roadmap/index.md)
2. [第一周详细计划](docs/roadmap/week-01.md)
3. [第一课：NAS 本质上为什么是一台计算机？](docs/lessons/week-01-computer-map/lesson-01-why-nas-is-a-computer.md)
4. [术语表](docs/glossary/glossary.md)

## 在本地运行

课程同时是一个可交互的学习站点：读课、答题、自动判分、进度追踪。

```bash
npm install
npm run docs:dev      # 打开 http://localhost:5173/
```

其他命令：

```bash
npm run docs:build    # 生成静态站点到 docs/.vitepress/dist
npm run docs:preview  # 预览生产构建（验证 base 路径和中文搜索要用这个）
npm run quiz:validate # 校验题库格式，答案键写错时会报出来
npm run check         # 校验题库 + 构建 + 检查私人笔记是否泄漏
```

> **本地进度与线上进度是分开的**
> 学习进度存在浏览器的 localStorage 里，按来源隔离。`localhost:5173` 上做的题**不会**
> 出现在 GitHub Pages 上，反之亦然。在[进度面板](docs/dashboard/index.md)里可以导出/导入。

## 仓库结构

```text
nas-ai-learning/
├─ docs/                          # 站点根目录（VitePress srcDir）
│  ├─ .vitepress/
│  │  ├─ config.mts               # base、中文搜索分词器、侧边栏
│  │  ├─ sidebar.mts              # 从课件 frontmatter 生成侧边栏
│  │  ├─ theme/                   # 布局插槽、答题组件、仪表盘组件
│  │  └─ data/                    # 构建期数据加载器
│  ├─ index.md                    # 首页
│  ├─ roadmap/                    # 学习地图与每周计划
│  ├─ lessons/week-NN-*/          # 60 个课件，每周一个目录
│  ├─ glossary/                   # 术语表（表格即真相来源）
│  ├─ dashboard/                  # 进度面板
│  └─ public/quiz/                # 题库与参考答案，按需加载
├─ scripts/                       # 题库校验、泄漏检查
├─ private-notes/                 # 本地私密记录，不进入 GitHub，也不进站点
└─ .github/workflows/             # 部署到 GitHub Pages
```

`private-notes/` 位于 `docs/` **之外**，所以站点构建在物理上就碰不到它 ——
不需要依靠排除规则。`npm run check:leak` 是第二道防线。

## 关于课件

每个课件遵循固定的 9 段结构：今天学习什么 → 为什么要学 → 小白解释 → 技术解释 →
类比 → NAS 实际场景 → 常见误区 → 知识地图 → 复述题与测试题。

题目和参考答案放在 `docs/public/quiz/lesson-NN.json`，与课件一一对应。
**课件正文里不含题目**，因为答题器会渲染在页面底部，正文里再放一份就会重复显示。
每课的 frontmatter 提供 `lessonId`、`week`、`day`、`domains`，侧边栏和进度统计都从它读取。

## 隐私原则

公开内容不包含公司内部资料、客户与订单信息、内部流程、未公开产品信息、内部聊天记录或敏感运营数据。工作中遇到的素材只会被抽象成通用场景。

`private-notes/` 已写入 `.gitignore`，其中的进度、错题和个人学习日志只保存在本地。

## 当前进度

- 当前阶段：全部 12 周内容已生成完毕
- 已完成内容：Week 1–12 各 5 课，共 60 课，连同 60 份题库与 12 份周计划全部就绪
- 状态：可完整学习、答题、周测；术语表收录 128 条

后续修订按「学完一周再改下一周」的节奏推进：内容已全部产出，但难度和风格
应在实际学习后按反馈调整。如果你在某一周发现讲得太浅或太深，告诉我具体是哪一课、
哪一段，我按你的反馈修订，而不是整周重写。
