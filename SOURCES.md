# 来源与版权说明

## 整合范围

本包按主题重组教学路线，独立编写中文讲解、代码和说明图。不重新分发三个原仓库的完整教程、Word、PPT、图片和板级工程。完整章节与来源映射见讲义附录 A。

| 来源 | 参考主题 | 原声明 |
| --- | --- | --- |
| [RoboWalker](https://github.com/yssickjgd/robowalker_train) | 外设、电机、PID、机器人系统 | README 标注 CC BY-NC，并有队内交流使用限制 |
| [WTR](https://github.com/MirTITH/WTR-EC-Training) | 多文件、通信、FreeRTOS、状态机、上位机 | README 标注 Copyright (C) 2022 WTRobot HITsz All rights reserved |
| [Newlegends](https://github.com/Electronic-control/Electronic_control_training) | C、工具和培训安排 | 查阅内容中未见明确的统一再分发许可 |

原作者和维护者保留原材料权利。这里的来源说明不构成对原材料的再授权；原作者后续更新的许可应以其仓库为准。

## 新增资料

单片机引入、基础供电、TB6612、步进电机、电桥、AI 原理和应用为本包新增组织内容。所有 examples 文件是教学实现，图示是原创说明图，其中 PID 图由合成对象仿真产生。

没有为整个资料包设置 MIT 或其他统一开源许可证。公开发布时，发布者可另行确定独立材料的署名和授权方式，但不得将其覆盖到第三方原文件。当前不包含第三方源代码、二进制和原图文件。

## 官方资料入口

- [ST STM32 入门](https://wiki.st.com/stm32mcu/wiki/Category:Getting_started_with_STM32_:_STM32_step_by_step)
- [ST AN4776 定时器](https://www.st.com/resource/en/application_note/dm00236305-pwm-generation-using-stm32-general-purpose-timers-stmicroelectronics.pdf)
- [C11 N1570 公开草案](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [Toshiba TB6612FNG](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/motor-driver-ics/brushed-dc-motor-driver-ics/detail.TB6612FNG.html)
- [TI 步进驱动](https://www.ti.com/product-category/motor-drivers/stepper/overview.html)
- [TI Buck 拓扑](https://www.ti.com/document-viewer/lit/html/SLVAFJ5)
- [NI 测量电桥](https://education.ni.com/teach/resources/1009/strain-gage?locale=en_US)
- [FreeRTOS 内存管理](https://www.freertos.org/Documentation/02-Kernel/02-Kernel-features/09-Memory-management/01-Memory-management)
- [Lund PID 实验](https://control.lth.se/fileadmin/control/Education/EngineeringProgram/FRTF05/lab1eng1.pdf)
- [Deep Learning](https://www.deeplearningbook.org/)
- [Transformer 原论文](https://arxiv.org/abs/1706.03762)

来源查阅与编写日期为 2026-10-07。本文的硬件示例均须按实际芯片、模块和设备手册核对。

## 本次补充资料

新增标准库、硬件、AI、网络与 Linux 官方入口列在讲义附录。用户指定视频和 RoboWalker 内部资源链接见 [学习资源](docs/学习资源.md)。代码风格参考用户的本地规范，未转载规范原文件；其中 F407 的工程要求未移植到 F107。
