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

1. [12 周学习地图](00-roadmap/learning-roadmap.md)
2. [第一周详细计划](00-roadmap/week-01-plan.md)
3. [第一课：NAS 本质上为什么是一台计算机？](01-computer-basics/lesson-01-why-nas-is-a-computer.md)
4. [术语表](glossary/glossary.md)

## 仓库结构

```text
nas-ai-learning/
├─ 00-roadmap/          # 路线图与每周计划
├─ 01-computer-basics/  # 计算机地图
├─ 02-nas-basics/       # NAS 基础
├─ 03-hardware/         # CPU、RAM、存储接口与扩展
├─ 04-storage/          # 文件系统、存储池、RAID 与备份
├─ 05-network/          # 家庭网络与远程访问
├─ 06-linux/            # Self-hosting 所需的 Linux 基础
├─ 07-docker/           # 容器与 Docker Compose
├─ 08-self-hosting/     # 真实项目拆解与实践
├─ 09-virtualization/   # VM、Hypervisor、Proxmox 与 KVM
├─ 10-ai-basics/        # LLM 与推理基础
├─ 11-ai-hardware/      # GPU、VRAM、量化与模型规模
├─ 12-local-ai/         # Ollama、LM Studio、llama.cpp、Open WebUI
├─ 13-ai-agent/         # Tools、Memory、RAG、MCP 与 Agent
├─ quizzes/             # 阶段测试与综合题
├─ glossary/            # 持续维护的术语表
└─ private-notes/       # 本地私密记录，不进入 GitHub
```

## 隐私原则

公开内容不包含公司内部资料、客户与订单信息、内部流程、未公开产品信息、内部聊天记录或敏感运营数据。工作中遇到的素材只会被抽象成通用场景。

`private-notes/` 已写入 `.gitignore`，其中的进度、错题和个人学习日志只保存在本地。

## 当前进度

- 当前阶段：Phase 0 — 计算机地图
- 当前课程：Lesson 1 — NAS 本质上为什么是一台计算机？
- 状态：课程已准备，等待学习、复述与答题
