# NAS & AI 学习笔记

> 一个文科背景的人，从零学 NAS、Self-hosting 与本地 AI 的 12 周记录。

**直接开始学习 → https://skylardai0718-byte.github.io/nas-ai-learning/**

不用安装任何东西，打开网址就能读课、答题、看解析、记录进度。

## 这是给谁的

面向非计算机专业的学习者。目标不是成为工程师，而是建立一套够用的知识体系：
看懂 NAS 规格表、理解家庭网络、部署基础自托管服务、判断本地 AI 硬件需求。

## 学完这 12 周，你能做到

- 看懂常见 NAS 硬件规格，也知道规格表没告诉你的信息。
- 分清一个故障出在存储、系统、网络、容器还是应用。
- 读懂入门级 GitHub README 和简单的 Docker Compose 文件。
- 在局域网内部署一个简单的 Self-hosted 服务。
- 粗略判断某个本地 AI 模型能不能在给定硬件上跑起来。
- 把核心概念准确地讲给不懂技术的人听。

## 学习节奏

每周 5 天，每天 45–60 分钟。每天 20–30 分钟学 3–5 个核心概念，剩下时间用来
闭卷复述和做题。第 5 天做周测。每课都有复述题和测试题，先作答、再批改。

## 12 周概览

| 周次 | 主问题 |
|---|---|
| Week 1 | NAS 为什么其实是一台计算机？ |
| Week 2 | 如何读懂一张 NAS 规格表？ |
| Week 3 | 数据如何从硬盘变成可用空间？RAID 为什么不等于备份？ |
| Week 4 | 家庭网络是怎样连起来的？ |
| Week 5 | 为什么在家能访问，出门却不能？ |
| Week 6 | Self-hosting 需要多少 Linux？ |
| Week 7 | Docker 到底解决什么问题？ |
| Week 8 | Docker Compose 在描述什么？ |
| Week 9 | 应用该跑在容器里还是 VM 里？ |
| Week 10 | 本地跑模型是在训练吗？ |
| Week 11 | 这台机器能不能跑这个模型？ |
| Week 12 | LLM 怎样变成一个 Agent？ |

每周的详细安排见[学习地图](docs/roadmap/index.md)。

## 关于进度

学习进度存在你自己浏览器的 localStorage 里，不会上传到任何地方。注意它是按
网站来源隔离的：线上站点和本地开发服务器的进度互不相通。在[进度面板](https://skylardai0718-byte.github.io/nas-ai-learning/dashboard/)
可以导出和导入，方便换设备或备份。

## 关于内容

课件按固定结构展开：今天学什么 → 为什么学 → 小白解释 → 技术解释 → 类比 →
实际场景 → 常见误区 → 知识地图 → 复述题与测试题。术语表收录 130 条。

12 周内容已全部完成（60 课 + 60 套题）。难度和讲法仍在按实际学习反馈调整——
如果你觉得某一课讲得太浅或太深，指出具体是哪课哪一段即可。

## 隐私

公开内容不包含公司内部资料、客户与订单信息、内部流程、未公开产品信息、内部聊天
记录或敏感运营数据。工作中遇到的素材只抽象成通用场景。

## 开发者信息

<details>
<summary>在本地运行 / 构建 / 校验（点击展开）</summary>

```bash
npm install
npm run docs:dev      # 本地开发服务器 http://localhost:5173/
npm run docs:build    # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview  # 预览生产构建（验证 base 路径和中文搜索要用这个）
npm run quiz:validate # 校验题库格式，答案键写错时会报出来
npm run check         # 题库校验 + 构建 + 检查私人笔记是否泄漏
```

**仓库结构**

```text
nas-ai-learning/
├─ docs/                          # 站点根目录（VitePress srcDir）
│  ├─ .vitepress/                 # 配置、侧边栏生成、主题组件、数据加载器
│  ├─ roadmap/                    # 学习地图与每周计划
│  ├─ lessons/week-NN-*/          # 60 个课件，每周一个目录
│  ├─ glossary/                   # 术语表（表格即真相来源）
│  ├─ dashboard/                  # 进度面板
│  └─ public/quiz/                # 题库与参考答案，按需加载
├─ scripts/                       # 题库校验、泄漏检查
├─ private-notes/                 # 本地私密记录，不进 GitHub 也不进站点
└─ .github/workflows/             # 部署到 GitHub Pages
```

**课件约定**

题目和参考答案放在 `docs/public/quiz/lesson-NN.json`，与课件一一对应。课件正文
里**不含题目**，因为答题器会渲染在页面底部。每课 frontmatter 提供 `lessonId`、
`week`、`day`、`domains`，侧边栏和进度统计都从这里读取。

`private-notes/` 位于 `docs/` **之外**，所以站点构建在物理上就碰不到它，不需要
依靠排除规则；`npm run check:leak` 是第二道防线。

</details>
