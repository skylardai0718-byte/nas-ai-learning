# Glossary

这个术语表只收录已经在课程中正式学过的词。解释会随着理解加深而修订，而不是一次写成百科全书。

| Term | 中文 | 一句话解释 | 分类 | 首次出现 |
|---|---|---|---|---|
| Computer | 计算机 | 接收信息、按照指令处理信息，并能保存或输出结果的系统。 | 基础概念 | Week 1, Day 1 |
| Hardware | 硬件 | 能实际触摸到、负责计算、临时记忆、长期存储和联网的物理部件。 | Hardware | Week 1, Day 1 |
| Operating System | 操作系统 | 管理硬件，并为应用程序提供统一运行环境的基础软件。 | Software | Week 1, Day 1 |
| Application | 应用程序 | 使用操作系统提供的能力，完成某个具体任务的软件。 | Software | Week 1, Day 1 |
| NAS | 网络附加存储 | 连接到网络、以存储和共享数据为核心用途的计算机。 | Storage | Week 1, Day 1 |
| CPU | 中央处理器 | 真正执行指令和运算的部件，决定处理任务的速度。 | Hardware | Week 1, Day 2 |
| RAM | 内存 | 临时存放正在使用的数据的部件，断电后内容会丢失，不能当长期仓库。 | Hardware | Week 1, Day 2 |
| Storage | 存储设备 | 长期保存数据的部件，断电后内容仍在，但速度通常比内存慢得多。 | Hardware | Week 1, Day 2 |
| Network | 网络部件 | 让设备与外界收发数据的部件，决定数据能否进出以及多快进出。 | Network | Week 1, Day 2 |
| Data | 数据 | 被处理的对象本身，例如一张照片文件或一段视频。 | 基础概念 | Week 1, Day 3 |
| Task | 任务 | 要对数据做的一件事，例如「保存这张照片」。 | 基础概念 | Week 1, Day 3 |
| Data Flow | 数据流 | 一次操作中数据在各部件之间经过的完整路径。 | 基础概念 | Week 1, Day 3 |
| Bottleneck | 瓶颈 | 数据流中最慢的那一段，它决定整个操作的实际表现。 | 基础概念 | Week 1, Day 3 |
| DAS | 直连存储 | 通过 USB 等方式直接连接一台设备的存储，只有那一台设备能用。 | Storage | Week 1, Day 4 |
| Cloud Storage | 云存储 | 数据保存在服务商管理的远程系统里，通常通过互联网访问。 | Storage | Week 1, Day 4 |
| Server | 服务器 | 一种角色：当一台计算机持续向其他设备提供资源或功能时，它就在扮演服务器。 | Self-hosting | Week 1, Day 5 |
| Service | 服务 | 计算机对外提供的某项具体功能，例如文件共享、影音播放或照片管理。 | Self-hosting | Week 1, Day 5 |
| Self-hosting | 自托管 | 在自己控制的设备上运行并维护服务，而不是用别人提供的现成服务。 | Self-hosting | Week 1, Day 5 |
| Homelab | 家庭实验室 | 用于学习、实验和运行个人服务的小型环境，一台 NAS 或迷你电脑就能起步。 | Self-hosting | Week 1, Day 5 |
| Core | 核心 | CPU 内部真正执行指令的独立单元，数量决定能同时处理多少任务。 | Hardware | Week 2, Day 1 |
| Thread | 线程 | 核心能同时维护的执行流数量；4 核 8 线程仍然是 4 个物理核心。 | Hardware | Week 2, Day 1 |
| Clock | 频率 | CPU 工作的节奏快慢，单位 GHz；只能在同一架构和代际内粗略比较。 | Hardware | Week 2, Day 1 |
| TDP | 热设计功耗 | 散热设计参考值，反映发热量级；不等于实际耗电量，也不是性能指标。 | Hardware | Week 2, Day 1 |
| x86 | x86 架构 | Intel 和 AMD 使用的 CPU 架构，软件生态最广，多数成品 NAS 使用它。 | Hardware | Week 2, Day 2 |
| ARM | ARM 架构 | 手机和低功耗设备常用的 CPU 架构，能效好，但软件需要专门适配。 | Hardware | Week 2, Day 2 |
| Capacity | 容量 | 内存能同时装下多少正在使用的数据；决定够不够，不决定快不快。 | Hardware | Week 2, Day 3 |
| DDR4 | DDR4 | 较成熟的一代内存规格，与 DDR5 插槽不兼容；用哪一代由主板决定。 | Hardware | Week 2, Day 3 |
| DDR5 | DDR5 | 较新的一代内存规格，带宽更高，但不能与 DDR4 混插。 | Hardware | Week 2, Day 3 |
| ECC | 纠错内存 | 能检测并纠正单个位错误的内存，降低静默损坏风险；需平台支持才有用。 | Hardware | Week 2, Day 3 |
| HDD | 机械硬盘 | 靠旋转盘片和磁头读写数据的存储介质；容量成本低，但有机械延迟、怕震动。 | Hardware | Week 2, Day 4 |
| SSD | 固态硬盘 | 靠闪存芯片读写数据的存储介质；随机读写快、静音抗震，但每 TB 成本高。 | Hardware | Week 2, Day 4 |
| SATA | SATA 接口 | 成熟且兼容性好的存储连接方式，有带宽上限，会限制 SSD 的性能发挥。 | Storage | Week 2, Day 4 |
| NVMe | NVMe | 为 SSD 设计的高速连接方式，走 PCIe 通道，速度远高于 SATA。 | Storage | Week 2, Day 4 |
| M.2 | M.2 外形 | 一种板卡外形规格，本身不决定速度；里面可能是 NVMe，也可能是 SATA。 | Hardware | Week 2, Day 4 |
| PCIe | PCIe 总线 | 主板上连接高速设备的总线，M.2 NVMe 硬盘、网卡和扩展卡都走它。 | Hardware | Week 2, Day 5 |
| Lane | 通道 | PCIe 的基本带宽单位，可类比车道数；x1 为一条，x16 为十六条。 | Hardware | Week 2, Day 5 |
| Disk | 磁盘 | 物理存储设备本身，只提供可按扇区寻址的连续空间，不含任何结构。 | Storage | Week 3, Day 1 |
| Partition | 分区 | 在磁盘上划分出的可独立使用的区域，只划分范围，不含文件组织规则。 | Storage | Week 3, Day 1 |
| File System | 文件系统 | 定义文件命名、目录结构和数据定位方式，没有它就只能按扇区读写。 | Storage | Week 3, Day 1 |
| Volume | 卷 | 可被挂载使用的逻辑存储单元，挂载后才出现在文件树中。 | Storage | Week 3, Day 1 |
| Storage Pool | 存储池 | 把多块硬盘的容量汇集成整体再划分卷，属于容量管理层的抽象。 | Storage | Week 3, Day 1 |
| RAID | 磁盘阵列 | 把多块硬盘组合成一个逻辑单元，换取容量、性能或容错。 | Storage | Week 3, Day 2 |
| RAID 0 | 条带阵列 | 数据分散到各盘，速度快、容量全用，但无任何容错，一盘坏全丢。 | Storage | Week 3, Day 2 |
| RAID 1 | 镜像阵列 | 数据完整写入两块盘，容忍一块损坏，但容量利用率只有一半。 | Storage | Week 3, Day 2 |
| JBOD | 磁盘串联 | 把几块盘的空间首尾相接成大容量，无性能提升也无容错。 | Storage | Week 3, Day 2 |
| RAID 5 | 分布式校验 | 存一份校验，容忍 1 块盘损坏；可用容量为（盘数−1）×单盘容量。 | Storage | Week 3, Day 3 |
| RAID 6 | 双校验阵列 | 存两份校验，容忍 2 块盘损坏；可用容量为（盘数−2）×单盘容量。 | Storage | Week 3, Day 3 |
| Backup | 备份 | 把数据复制到另一个位置形成独立副本，能保留历史、可回到过去。 | Storage | Week 3, Day 4 |
| Snapshot | 快照 | 记录某一时刻的数据状态，创建和回退都快，但通常依赖原存储。 | Storage | Week 3, Day 4 |
| Sync | 同步 | 让两个位置的内容保持一致；目标是「一致」，不保留历史版本。 | Storage | Week 3, Day 4 |
| Network | 网络 | 能够互相传递数据的设备集合，需要物理连接、统一规则和寻址机制。 | Network | Week 4, Day 1 |
| LAN | 局域网 | 范围小、速度快、由自己管理的本地网络，家里的设备都在其中。 | Network | Week 4, Day 1 |
| WAN | 广域网 | 范围更大的网络，由运营商维护，互联网是最大的 WAN。 | Network | Week 4, Day 1 |
| Router | 路由器 | 在不同网络之间转发数据，是 LAN 与 WAN 的交界和默认安全边界。 | Network | Week 4, Day 2 |
| Switch | 交换机 | 在同一个网络内部转发数据，用于扩展有线接口数量，不改变网络边界。 | Network | Week 4, Day 2 |
| IP Address | IP 地址 | 设备在网络中的位置标识；标识位置而非设备本身，换网络会变。 | Network | Week 4, Day 3 |
| Private IP | 私有地址 | 只在本地网络内部有效的地址，可重复使用，互联网不转发。 | Network | Week 4, Day 3 |
| Public IP | 公网地址 | 在互联网上唯一的地址，由运营商分配，家庭通常只有一个。 | Network | Week 4, Day 3 |
| DHCP | 动态主机配置 | 设备接入网络时自动分配 IP 地址；分配的是有期限的租约。 | Network | Week 4, Day 4 |
| DNS | 域名系统 | 把域名翻译成 IP 地址的服务，相当于网络世界的电话簿。 | Network | Week 4, Day 4 |
| Port | 端口 | 标识设备上的具体服务；IP 定位设备，端口定位服务。 | Network | Week 5, Day 1 |
| TCP | 传输控制协议 | 面向连接的可靠传输，有确认和重传机制，适合文件传输与网页。 | Network | Week 5, Day 1 |
| UDP | 用户数据报协议 | 无连接的传输方式，不保证送达但开销小延迟低，适合实时音视频。 | Network | Week 5, Day 1 |
| NAT | 网络地址转换 | 让多台内网设备共用一个公网地址；内部出去容易，外部进来默认不通。 | Network | Week 5, Day 2 |
| Port Forwarding | 端口转发 | 把外部发往某端口的请求转交给内网设备；代价是该端口对全网开放。 | Network | Week 5, Day 2 |
| DDNS | 动态域名解析 | 用固定域名指向会变化的公网地址，解决「地址会变」的问题。 | Network | Week 5, Day 3 |
| Firewall | 防火墙 | 按规则决定哪些连接放行；默认允许内部出去、拒绝外部主动进入。 | Network | Week 5, Day 3 |
| VPN | 虚拟专用网络 | 在设备与目标网络之间建立加密通道，让设备像处在那个网络里。 | Network | Week 5, Day 4 |
| WireGuard | WireGuard | 一种现代 VPN 协议，代码简洁、性能好，是 Tailscale 的基础。 | Network | Week 5, Day 4 |
| Tailscale | Tailscale | 基于 WireGuard 的零配置方案，自动建立设备间的私有网络。 | Self-hosting | Week 5, Day 4 |
| Linux | Linux | 一类开源操作系统的内核与生态，NAS 系统大多基于它。 | Linux | Week 6, Day 1 |
| Distribution | 发行版 | 把 Linux 内核和一堆软件打包成的完整系统，如 Debian、Ubuntu。 | Linux | Week 6, Day 1 |
| Shell | Shell | 接收你输入的命令并交给系统执行的程序，是人和系统的中间层。 | Linux | Week 6, Day 2 |
| Terminal | 终端 | 让你输入命令、看到输出的那个窗口，本身不等于 Shell。 | Linux | Week 6, Day 2 |
| SSH | 安全外壳协议 | 远程登录另一台设备并操作它的加密通道。 | Linux | Week 6, Day 2 |
| root | 超级用户 | Linux 中权限最高的账户，能做任何事，也因此最危险。 | Linux | Week 6, Day 3 |
| sudo | sudo | 临时以 root 权限执行一条命令，而不是长期以 root 身份工作。 | Linux | Week 6, Day 3 |
| Permission | 权限 | 规定谁能读、写、执行某个文件，是 Linux 安全的基础。 | Linux | Week 6, Day 3 |
| Directory | 目录 | 用来组织文件的容器，Linux 中目录本身也是一种文件。 | Linux | Week 6, Day 4 |
| Path | 路径 | 描述文件或目录位置的写法，分绝对路径和相对路径。 | Linux | Week 6, Day 4 |
| Docker | Docker | 把应用和它的依赖打包成镜像并运行的容器化工具。 | Docker | Week 7, Day 2 |
| Image | 镜像 | 应用的只读打包模板，包含代码、依赖和配置；不是正在运行的程序。 | Docker | Week 7, Day 2 |
| Container | 容器 | 镜像运行起来的实例，可以启动、停止、删除，删除后自带数据会丢。 | Docker | Week 7, Day 2 |
| Volume | 数据卷 | 独立于容器生命周期的存储，容器删了数据仍在，是持久化的关键。 | Docker | Week 7, Day 3 |
| Bind Mount | 绑定挂载 | 把宿主机上的某个目录直接映射进容器，方便直接查看和修改。 | Docker | Week 7, Day 3 |
| Port Mapping | 端口映射 | 把宿主机的端口对应到容器内的端口，如 8080:80，外部才能访问。 | Docker | Week 7, Day 4 |
| Environment Variable | 环境变量 | 在启动容器时传入的配置值，常用来传密码、路径、开关选项。 | Docker | Week 7, Day 4 |
| Docker Network | Docker 网络 | 让多个容器之间能够互相通信的虚拟网络。 | Docker | Week 7, Day 5 |
| Docker Compose | Compose | 用一个 YAML 文件描述多个容器的镜像、端口、卷和变量。 | Docker | Week 8, Day 1 |
| YAML | YAML | 一种靠缩进表达层级的配置格式，Compose 文件就用它写。 | Docker | Week 8, Day 1 |
| Service | 服务 | Compose 文件里的一个单元，通常对应一个容器。 | Docker | Week 8, Day 1 |
| Container Lifecycle | 容器生命周期 | 容器从创建、启动、停止到删除的完整过程。 | Docker | Week 8, Day 3 |
| Virtual Machine | 虚拟机 | 靠软件模拟出来的一台完整计算机，自带独立操作系统。 | Self-hosting | Week 9, Day 4 |
| Hypervisor | 虚拟机管理程序 | 在物理硬件上创建和运行虚拟机的软件层。 | Self-hosting | Week 9, Day 4 |
| Proxmox | Proxmox | 一个开源虚拟化平台，常用于家庭 Homelab 管理虚拟机和容器。 | Self-hosting | Week 9, Day 5 |
| KVM | KVM | Linux 内核自带的虚拟化技术，是 Proxmox 等平台的底层基础。 | Self-hosting | Week 9, Day 5 |
| Jellyfin | Jellyfin | 开源的影音媒体服务，用于整理和播放自己的影视库。 | Self-hosting | Week 9, Day 2 |
| Pi-hole | Pi-hole | 自建的 DNS 服务，可以拦截广告域名并查看查询记录。 | Self-hosting | Week 9, Day 3 |
| Immich | Immich | 开源的手机照片备份与管理服务，可自托管。 | Self-hosting | Week 9, Day 3 |
| AI | 人工智能 | 让机器完成通常需要人类智能的任务的统称，范围最大。 | AI | Week 10, Day 1 |
| Machine Learning | 机器学习 | AI 的一个分支，让程序从数据中自己找出规律，而不是逐条写规则。 | AI | Week 10, Day 1 |
| Neural Network | 神经网络 | 机器学习中一类受大脑启发的模型结构，深度学习的基础。 | AI | Week 10, Day 1 |
| LLM | 大语言模型 | 在海量文本上训练出的语言模型，能理解和生成自然语言。 | AI | Week 10, Day 2 |
| Model | 模型 | 训练留下的成果文件，包含学到的参数，不是数据库也不是程序。 | AI | Week 10, Day 2 |
| Parameter | 参数 | 模型内部学到的数值，动辄数十亿个；不是用户可调的设置项。 | AI | Week 10, Day 2 |
| Token | Token | 模型处理文本的最小单位，大致相当于一个词或半个词。 | AI | Week 10, Day 3 |
| Context Window | 上下文窗口 | 模型一次能同时看到的 token 上限，不等于永久记忆。 | AI | Week 10, Day 3 |
| Training | 训练 | 用大量数据反复调整参数，产出模型的过程，耗时且昂贵。 | AI | Week 10, Day 4 |
| Inference | 推理 | 加载已有模型来处理输入、生成输出，日常使用都是在推理。 | AI | Week 10, Day 4 |
| GPU | 图形处理器 | 拥有大量并行计算单元，擅长同时处理海量简单运算，适合模型推理。 | Hardware | Week 11, Day 1 |
| NPU | 神经网络处理器 | 专为神经网络运算设计的处理器，能效高但通用性弱。 | Hardware | Week 11, Day 1 |
| VRAM | 显存 | GPU 自带的专用内存，容量决定模型能否加载，是硬性门槛。 | Hardware | Week 11, Day 2 |
| Memory Bandwidth | 显存带宽 | 数据进出显存的速度上限，决定模型生成 token 的快慢。 | Hardware | Week 11, Day 2 |
| CUDA Core | CUDA 核心 | GPU 中执行通用并行计算的单元，数量影响并行处理能力。 | Hardware | Week 11, Day 2 |
| Tensor Core | 张量核心 | GPU 中专门加速矩阵运算的单元，与 AI 计算关系密切。 | Hardware | Week 11, Day 2 |
| Quantization | 量化 | 用更少的位数表示每个参数，大幅缩小模型体积、降低显存需求。 | AI | Week 11, Day 3 |
| FP16 | 半精度浮点 | 每个参数占 16 位（2 字节），是常见的模型精度格式。 | AI | Week 11, Day 3 |
| INT8 | 八位整数 | 每个参数占 8 位（1 字节），体积约为 FP16 的一半。 | AI | Week 11, Day 3 |
| INT4 | 四位整数 | 每个参数占 4 位，体积约为 FP16 的四分之一，精度损失更明显。 | AI | Week 11, Day 3 |
| Model Size | 模型体积 | 参数量乘以每个参数的字节数，决定需要多少显存才能装下。 | AI | Week 11, Day 3 |
| Tools | 工具 | 提供给模型调用的外部能力，让它可以查询、计算或操作文件。 | AI | Week 12, Day 1 |
| Function Calling | 函数调用 | 模型输出一个结构化的调用意图，真正执行的是外面的程序。 | AI | Week 12, Day 1 |
| Memory | 记忆 | Agent 保存和复用历史信息的能力，让多轮任务能连贯进行。 | AI | Week 12, Day 2 |
| Agent | 智能体 | 让模型自己决定下一步用什么工具、看什么结果、何时停止的循环结构。 | AI | Week 12, Day 2 |
| Workflow | 工作流 | 步骤事先定死的流程，与 Agent 自主决策的方式相对。 | AI | Week 12, Day 2 |
| RAG | 检索增强生成 | 先检索相关资料、放进上下文、再让模型基于资料回答。 | AI | Week 12, Day 3 |
| Retrieval | 检索 | 从已有资料中找出与问题最相关的内容这一步。 | AI | Week 12, Day 3 |
| Vector Database | 向量数据库 | 按语义相似度存储和查找内容的数据库，是 RAG 的常见组件。 | AI | Week 12, Day 3 |
| MCP | 模型上下文协议 | 一种标准化方式，让模型能以统一接口连接外部工具和数据源。 | AI | Week 12, Day 4 |
| Permission Boundary | 权限边界 | 规定一个程序能碰哪些数据、能做哪些操作，是自动化的安全底线。 | Self-hosting | Week 12, Day 4 |
