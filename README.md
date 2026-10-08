# 电控培训与计算机基础

这是面向机器人电控新成员的中文教学与自学资料。以 Keil MDK、STM32F107 和 STM32F10x 标准外设库为实践基础，从电子硬件与 C 语言开始，逐步学习 GPIO、定时器、PWM、电机驱动与 PID，再认识计算机、网络、Linux 和人工智能。

AI 部分讲原理、历史、术语与应用，不安排模型训练或小模型部署。本文VPN只做讲解科学原理。

## 从哪里开始

- [下载 Word 讲义](机器人电控与人工智能入门培训讲义.docx)：完整教学材料，包含解释、事例、图示、代码及思考练习。
- [在线阅读讲义](docs/培训讲义.md)：与 Word 同源的 Markdown 版，便于 GitHub 阅读与检索。
- [示例运行与工程集成](examples/README.md)：说明电脑端程序、标准库模块的依赖、调用顺序与验证范围。
- [学习资源](docs/学习资源.md)：三个参考仓库、RoboWalker README 中的资源链接以及视频入口。
- [代码风格](docs/代码风格.md)、[来源与版权说明](SOURCES.md)、[文件变更清单](文件清单.md)。

零基础读者建议依次学习硬件 → C 语言 → 最小工程 → GPIO → PWM → 电机 → 反馈控制。网络、Linux 与 AI 可独立阅读。先看原理，再看代码，最后完成每章的事例和练习。

## 课程内容

- 第 1 章 从机器人认识嵌入式
- 第 2 章 单片机与 STM32 的引入
- 第 3 章 C 语言基础语法
- 第 4 章 数组 指针 结构体与位操作
- 第 5 章 源文件 头文件与编译过程
- 第 6 章 Keil 与标准库工程入门
- 第 7 章 GPIO 按键与中断
- 第 8 章 定时器与 PWM 波
- 第 9 章 ADC UART 与数据帧
- 第 10 章 电机 驱动器 编码器与 CAN
- 第 11 章 PID 控制原理与完整实现
- 第 12 章 裸机调度 FreeRTOS 与状态机
- 第 13 章 机器人综合事例与工程协作
- 第 14 章 AI 的基本原理
- 第 15 章 大语言模型 视觉与嵌入式 AI
- 第 16 章 实验安排 习题与验收
- 第 17 章 网络 DNS 与 VPN 入门
- 第 18 章 Linux 与 Windows 基础

硬件部分解释 VSS、GND、VDD、VCC、模拟地与数字地、供电与电平、降压模块，以及 H 桥和测量电桥的区别；解释 CPU、GPU、RAM、SSD 与 Flash，比较 STM32、ESP32 和 Arduino。

C 语言部分涉及变量、数据类型、条件、循环、函数、数组、指针、结构体、位操作、头文件、声明与定义，以及编译和链接。STM32 部分说明通用推挽、复用推挽、开漏、上拉与下拉等 GPIO 模式。

电机部分区分 TB6612 的有刷直流电机驱动与专用步进电机驱动，解释开环、闭环、编码器、PID 的 P/I/D 项、采样周期、输出限幅及积分限制。AI 部分解释训练与推理、神经网络、Transformer、生成式 AI 的演进、Agent、MCP、插件、Skill、RAG 与应用边界。

## 实践环境和示例

STM32 示例使用 **STM32F107 + Keil MDK + STM32F10x SPL**。使用连接型器件对应的 `startup_stm32f10x_cl.s`，工程宏包含 `STM32F10X_CL` 和 `USE_STDPERIPH_DRIVER`。这是一组教学模块，不是已经验证过的整板 Keil 工程；完整型号、晶振、LED 极性和板级接线须按实际开发板核对。

| 目录 | 学习内容 |
| --- | --- |
| `examples/c_basics` | C 基础、状态结构体与位操作 |
| `examples/multi_file` | `.c/.h` 的声明、定义和链接 |
| `examples/protocol` | 字节流解析及校验示例 |
| `examples/state_machine` | 使能、运行与故障状态 |
| `examples/pid` | C 控制器和 Python 一阶对象仿真 |
| `examples/stepper` | 步进脉冲数量计算 |
| `examples/stm32_stdperiph` | User/Hardware/System 结构的标准库模块 |
| `examples/arduino/Blink` | Arduino 闪灯示例，帮助理解生态差异 |

STM32 模块包含 LED、消抖按键、SysTick 延时、TIM3 中断、TIM2 PWM、ADC1、电机 A 通道和 GPIO 模式示例。各例应分别学习与集成：PA0/TIM2 在 PWM 与电机模块之间复用，不能直接同时启用。TB6612 示例只控制 A 通道，直接反向请求会先停止；调用方需等待电流或速度衰减并规划反转。它不包含编码器，因此单独运行属于开环。

电脑端 C 示例需要自行准备 C11 编译器，命令与预期输出见 examples/README.md。Python PID 仿真可在仓库根目录运行：

```sh
python examples/pid/simulate.py
```

程序生成 `pid_trace.csv`。教学对象与参数是人为设定的，不能直接当作实际电机参数。已运行 Python 仿真并检查采样数据；C 示例、Keil 工程与硬件未进行编译或实机验证。

## 参考与视频

内容按教学顺序重新组织，参考以下仓库的课程主题和资源导航，没有把第三方整个工程或文档复制进本仓库：

- [RoboWalker](https://github.com/yssickjgd/robowalker_train)
- [WTR EC Training](https://github.com/MirTITH/WTR-EC-Training)
- [Electronic control training](https://github.com/Electronic-control/Electronic_control_training)

用户指定的视频主页：

- [Bilibili UID 394620890](https://space.bilibili.com/394620890)
- [Bilibili UID 383400717](https://space.bilibili.com/383400717)
- [Bilibili UID 37974444](https://space.bilibili.com/37974444)

RoboWalker 内的其他资料入口已列在[学习资源](docs/学习资源.md)和 Word 附录。外部页面可能变动，原作品的署名与授权以原作者页面为准。硬件参数和外设操作优先核对 ST、Toshiba、TI 等官方资料。

## 如何参与完善

欢迎通过 Issue 说明错别字、原理错误、失效链接或接线疑问。提出代码修改时，请写明芯片完整型号、板卡、时钟、编译器版本、复现步骤与实际结果；硬件验证需与纯软件仿真分开说明。Pull Request 请遵循现有模块风格，并同步更新讲义中的代码和使用说明。

本仓库的公开发布不改变第三方材料的版权。独立示例及讲义的授权边界见 SOURCES.md；不要将链接所指向的第三方作品视为可任意转载。

互助，开源，共享是科学真正的精神。
