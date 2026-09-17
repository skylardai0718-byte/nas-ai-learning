# 12 周学习地图

## 这 12 周要完成什么

这是一轮“完整但够用”的知识体系搭建，不追求工程师级深度。12 周结束时，你应能：

- 看懂常见 NAS 硬件规格，并知道规格没有告诉你的信息。
- 分清存储、系统、网络、容器和应用问题。
- 阅读入门级 GitHub README 与简单的 Docker Compose 文件。
- 在局域网内部署一个简单的 Self-hosted 服务。
- 粗略判断本地 AI 模型能否在给定硬件上运行。
- 把核心概念准确地讲给非技术用户。

## 固定学习节奏

每周 5 天，每天 45–60 分钟：

- 20–30 分钟：学习 3–5 个核心概念。
- 10–15 分钟：闭卷复述或画关系图。
- 10–15 分钟：测试或小实践。
- 第 5 天额外完成 Weekly Review，更新错题与 Knowledge Score。

每周测试不会只考定义。默认包含选择题、判断题、简答题和场景题，先答题、后批改。

## 总览

| 周次 | 对应阶段 | 主问题 | 周末应具备的能力 |
|---|---|---|---|
| Week 1 | Phase 0–1 | NAS 为什么是一台计算机？ | 画出硬件—操作系统—应用地图，区分 NAS、DAS、云存储、Server、Self-hosting |
| Week 2 | Phase 2 | 如何读 NAS 规格表？ | 解释 CPU、RAM、HDD/SSD、SATA/NVMe/M.2 与 PCIe |
| Week 3 | Phase 3 | 数据如何从硬盘变成可用空间？ | 区分 Disk、Partition、File System、Volume、Pool、RAID、Backup、Snapshot、Sync |
| Week 4 | Phase 4A | 家庭网络是怎样连起来的？ | 理解 LAN/WAN、Router/Switch、IP、DHCP、DNS |
| Week 5 | Phase 4B | 为什么在家能访问，出门却不能？ | 理解 Port、TCP/UDP、NAT、DDNS、Firewall、VPN 与 Tailscale |
| Week 6 | Phase 5 | Self-hosting 需要多少 Linux？ | 能通过终端安全地浏览、创建、移动和编辑练习文件 |
| Week 7 | Phase 6A | Docker 到底解决什么问题？ | 真正区分 Image、Container、Volume、Port、Environment、Network |
| Week 8 | Phase 6B | Docker Compose 在描述什么？ | 能逐段读懂简单 Compose，并讲清数据与访问入口 |
| Week 9 | Phase 7–8 | 应用运行在哪里：容器还是 VM？ | 用统一框架分析 Self-hosted 项目，并区分 VM 与 Docker |
| Week 10 | Phase 9 | 本地运行模型是在训练吗？ | 理解 AI、ML、LLM、Parameter、Token、Context、Training、Inference |
| Week 11 | Phase 10–11 | 这台机器能不能跑这个模型？ | 理解 GPU/VRAM/量化，并看懂 Local AI 软件栈 |
| Week 12 | Phase 12 | LLM 怎样变成 Agent？ | 理解 Tools、Memory、Function Calling、MCP、RAG 与 NAS + AI 架构 |

---

## Week 1：从计算机地图到 NAS 基础

**Phase 0 → Phase 1**

| 天 | 核心内容 | 当天产出 |
|---|---|---|
| Day 1 | Computer、Hardware、Operating System、Application、NAS | NAS 三层地图与 100 字复述 |
| Day 2 | CPU、RAM、Storage、Network 的角色 | 四类硬件角色卡 |
| Day 3 | Task、Data、Data Flow、Bottleneck | 照片上传与视频播放数据流图 |
| Day 4 | NAS、DAS、Cloud Storage | 三者比较表与场景选择 |
| Day 5 | Server、Service、Self-hosting、Homelab | 综合关系图、周测与 Weekly Review |

**学习结果：**能用自己的话解释 NAS 为什么是一台计算机；能把简单故障先放入硬件、操作系统、应用或网络层；能区分 NAS、移动硬盘和云存储。

**公开产出建议：**`Why a NAS Is Actually a Computer`。

详细安排见 [第一周详细计划](week-01-plan.md)。

---

## Week 2：读懂 NAS 硬件规格

**Phase 2**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | Core、Thread、Clock、TDP | 给一张 CPU 规格卡逐项写人话解释，不比较跑分 |
| Day 2 | x86、ARM | 从软件兼容性、功耗与使用场景比较，不钻指令集细节 |
| Day 3 | RAM、Capacity、DDR4、DDR5、ECC | 区分容量、代际与纠错能力 |
| Day 4 | HDD、SSD、SATA、NVMe、M.2 | 分清存储介质、连接/传输方式与外形规格 |
| Day 5 | PCIe、Lane、x1/x4/x8/x16 | 读一张简化规格表并完成周测 |

**学习结果：**看到 `Intel N150 / 16GB DDR5 / 2×SATA / 1×M.2 NVMe / PCIe 3.0 x1` 时，能逐项解释，也知道不能只凭一行规格断言实际性能。

**公开产出建议：**`How to Read a NAS Spec Sheet`。

---

## Week 3：存储系统与数据保护

**Phase 3**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | Disk、Partition、File System、Volume、Storage Pool | 从物理磁盘到用户文件画出简化关系图 |
| Day 2 | RAID 0、RAID 1、JBOD | 从容量、性能、容错三个维度比较 |
| Day 3 | RAID 5、RAID 6、可用容量、容错 | 对相同容量硬盘做简单容量与故障判断 |
| Day 4 | Backup、Snapshot、Sync | 为误删、硬盘故障、勒索软件和设备被盗选择保护方式 |
| Day 5 | `RAID ≠ Backup` | 综合场景周测与订正 |

**学习结果：**区分磁盘、文件系统、卷和存储池；清楚说明 RAID、备份、快照和同步解决的是不同问题。

**公开产出建议：**`RAID Is Not Backup` 与一张四者对比图。

---

## Week 4：家庭网络的基本地图

**Phase 4，上半部分**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | Network、LAN、WAN | 画出手机、NAS、路由器和互联网的位置 |
| Day 2 | Router、Switch | 解释家用路由器为什么常常同时承担多种工作 |
| Day 3 | IP Address、Private IP、Public IP | 在示意图中标出内网与公网地址，不做子网计算 |
| Day 4 | DHCP、DNS | 从“分配地址”和“把名字查成地址”理解两者 |
| Day 5 | 局域网访问路径 | 追踪手机在家访问 NAS 的完整路径并完成周测 |

**学习结果：**理解手机为何能在家中找到 NAS；区分 LAN/WAN、私有/公网 IP，以及 Router、Switch、DHCP、DNS 的职责。

**公开产出建议：**`How My Home Network Works`。只使用示例地址，不发布真实公网 IP、域名或设备信息。

---

## Week 5：端口、NAT 与安全远程访问

**Phase 4，下半部分**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | Port、TCP、UDP | 理解 `IP:Port` 如何定位到设备上的具体服务 |
| Day 2 | NAT、Port Forwarding | 画出公网请求被转发到 NAS 服务的路径 |
| Day 3 | DDNS、Firewall | 分别解决“地址会变”和“谁能进入”的问题 |
| Day 4 | VPN、WireGuard、Tailscale、P2P Remote Access | 比较暴露端口与建立私有网络两种思路 |
| Day 5 | 远程访问综合题 | 完整回答“为什么在家能访问，出门却不能” |

**学习结果：**解释 NAT、端口转发、DDNS 与防火墙的关系；从原理上理解 Tailscale 为什么能简化远程访问。

**公开产出建议：**`Why Remote Access Fails` 与 `Port Forwarding vs Tailscale` 概念图。

---

## Week 6：Self-hosting 够用的 Linux

**Phase 5**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | Linux、Distribution、Debian、Ubuntu | 解释 Linux 与发行版的关系 |
| Day 2 | Shell、Terminal、SSH | 画出电脑远程操作 NAS 的路径 |
| Day 3 | User、root、sudo、Permission；`pwd`、`ls`、`cd` | 解释为什么不应长期使用 root |
| Day 4 | Directory、Path；`mkdir`、`cp`、`mv`、`cat`、`nano`、`rm` | 只在专用练习目录操作，删除前确认路径 |
| Day 5 | 终端场景周测 | 根据操作记录说明“在哪里、做了什么、需要什么权限” |

**学习结果：**能通过终端安全地浏览和编辑练习文件；遇到 `Permission denied` 时先判断路径、用户和权限，而不是盲目使用 `sudo`。

**公开产出建议：**`Linux for Self-hosting — A Beginner's Cheatsheet`，不发布用户名、主机名、密钥或真实路径。

---

## Week 7：真正理解 Docker 的核心对象

**Phase 6，上半部分**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | 依赖、环境一致性、隔离 | 比较传统安装与容器化安装 |
| Day 2 | Docker、Image、Container | 解释 Image 为什么不是正在运行的应用 |
| Day 3 | Volume、Bind Mount、Persistence | 判断删除容器后哪些数据必须保留 |
| Day 4 | Port Mapping、Environment Variable | 读懂 `8080:80` 与示例变量 |
| Day 5 | Docker Network | 闭卷画出 `Image → Container → Volume → Port` 并完成周测 |

**学习结果：**区分 Image 与 Container；解释持久数据、端口映射和目录挂载，不靠死记命令。

**公开产出建议：**`How I Finally Understood Docker`。

---

## Week 8：Docker Compose 与部署阅读

**Phase 6，下半部分**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | Docker Compose、YAML、Service | 将长命令理解为结构化配置 |
| Day 2 | `image`、`ports`、`volumes`、`environment` | 给简单 Compose 文件逐段写中文旁注 |
| Day 3 | 创建、停止、日志、升级 | 理解容器生命周期，不背完整命令 |
| Day 4 | 无敏感数据的示例服务 | 先预测访问地址和数据位置，再验证 |
| Day 5 | Compose 综合题 | 从模板补齐镜像、端口、卷和环境变量 |

**学习结果：**能根据 README 找到镜像、端口、数据目录和必填变量；完成或完整讲述一次仅在局域网开放的部署。

**公开产出建议：**`Compose from Zero` 与去敏后的 `compose.example.yaml`。

---

## Week 9：Self-hosted 服务、VM 与 Docker

**Phase 7 → Phase 8**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | 项目六问法 | 回答：解决什么、硬件需求、运行位置、联网方式、数据位置、Docker 作用 |
| Day 2 | Jellyfin | 分析服务端、客户端、媒体数据与硬件转码的位置 |
| Day 3 | Pi-hole、Immich、Tailscale | 三选一深入；Home Assistant 与 Vaultwarden 第一轮只做定位 |
| Day 4 | Virtual Machine、Hypervisor、VM vs Docker | 从“是否带完整 OS、隔离、开销”准确比较 |
| Day 5 | Proxmox、KVM；虚拟化周测 | 为三个家庭场景选择裸机、Docker 或 VM |

> 用户原路线中的 “ZVM” 指代可能有歧义，正式学到这里时先确认具体产品或技术名称，再决定是否纳入；第一轮不为一个不确定术语扩展范围。

**学习结果：**能用统一框架阅读 Self-hosted 项目 README，并根据是否需要独立操作系统、隔离程度和资源开销选择 VM 或 Docker。

**公开产出建议：**`How to Evaluate a Self-hosted App` 与 `VM vs Docker`。

---

## Week 10：AI、LLM 与推理基础

**Phase 9**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | AI、Machine Learning、Neural Network | 画出包含关系，不学习数学推导 |
| Day 2 | LLM、Model、Parameter | 解释模型不是普通数据库，Parameter 不是用户设置项 |
| Day 3 | Token、Context Window | 理解上下文长度不等于永久记忆 |
| Day 4 | Training、Inference | 比较二者目的与资源需求 |
| Day 5 | AI 基础周测 | 画出“训练产生模型，推理加载模型”的路径 |

**学习结果：**把 LLM 放回 AI 地图；解释参数、Token 与 Context Window；清楚说明在 NAS 上使用现成模型通常是在推理，不是在训练。

**公开产出建议：**`Training vs Inference`。

---

## Week 11：AI Hardware 与 Local AI 软件栈

**Phase 10 → Phase 11**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | CPU、GPU、NPU | 为低频问答、图像识别和 LLM 推理判断硬件角色 |
| Day 2 | CUDA Core、Tensor Core、VRAM、Memory Bandwidth | 重点理解 VRAM 容量与带宽，核心数只作定位 |
| Day 3 | Model Size、FP16、INT8、INT4、Quantization | 粗略比较同一模型不同量化的体积与需求 |
| Day 4 | `Model → Inference Engine → API → Application` | 放置 Ollama、LM Studio、llama.cpp、Open WebUI |
| Day 5 | `7B Q4 / 8GB VRAM` 场景周测 | 判断能否加载、是否可能慢，以及还缺哪些信息 |

**学习结果：**解释 CPU/GPU/NPU 的基本分工；理解 VRAM、带宽、模型大小和量化的关系；粗略判断为什么 7B 量化模型可能运行而 70B 不行。

**公开产出建议：**`Can This Model Run?` 与 `The Local AI Stack`。

---

## Week 12：AI Agent、RAG 与 NAS + AI

**Phase 12**

| 天 | 核心内容 | 实践与复述 |
|---|---|---|
| Day 1 | LLM、Tools、Function Calling | 区分“模型建议操作”和“系统真实执行操作” |
| Day 2 | Memory、Agent、Workflow | 解释 Agent 不是万能且完全自主的程序 |
| Day 3 | RAG、Retrieval、Vector Database | 画出“检索资料 → 放入上下文 → 生成回答”的路径 |
| Day 4 | MCP、Permission Boundary、NAS + AI Agent | 设计只读访问 NAS 文档的 Agent，并指出隐私和误操作风险 |
| Day 5 | Final Review | 从 NAS 硬件一路画到 AI 应用，完成最终综合测试 |

**学习结果：**解释 LLM、工具、记忆与 Agent 的关系；区分 Function Calling、MCP 与 RAG；向非技术用户讲清一个基础的 NAS + Local AI + RAG 架构。

**公开产出建议：**`NAS + AI Agent` 与 12 周学习反思。

## 最终综合测试

至少包含三类综合场景：

1. 解释 `Intel N150 / 16GB DDR5 / 2×2.5GbE / PCIe 3.0 x1 / 2×SATA / 1×NVMe` 的含义与可能限制。
2. 阅读包含 `image`、`8080:80`、`volume`、`environment` 的 Compose 文件，指出应用、访问入口和数据位置。
3. 判断 8GB VRAM 设备运行 `7B Q4` 与 `70B` 模型的可能性，并把模型、推理引擎、API、应用和 NAS 数据源画在一张图中。

## Knowledge Score 的证据标准

- **Beginner**：听过术语，但无法准确解释。
- **Basic**：能说出大意，但仍需要提示。
- **Working Knowledge**：能独立解释，并完成基础场景题。
- **Comfortable**：能比较方案、排查常见问题。
- **Strong**：能向新手讲清楚，并指出边界与常见误区。

未正式学习的领域保持 `Beginner（尚未开始）`，不为了让进度曲线好看而提前加分。
