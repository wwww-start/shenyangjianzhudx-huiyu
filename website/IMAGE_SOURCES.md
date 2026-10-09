# 图片与数据来源

下列 SVG 全部由本项目为教学绘制，未复制第三方图像。它们是原理/结构示意，不是实物照片或制造接线图。

| 文件 | 内容 |
|---|---|
| robot.svg | 机器人感知、计算、执行链 |
| mcu.svg | 单片机功能结构 |
| compile.svg | 编译与启动流程 |
| power.svg | 电源与信号概念路径 |
| board.svg | F107 学习板结构示意 |
| clock.svg | 简化时钟路径 |
| gpio.svg | 推挽与开漏概念 |
| pwm.svg | 不同占空比 |
| motor.svg | 电机反馈流程 |
| pid.svg | 负反馈框图 |
| response.svg | 人工绘制的响应趋势示意，非数值数据 |
| neural.svg | 神经网络计算结构 |
| transformer.svg | 简化解码器式模型 |
| agent.svg | 工具调用与结果反馈 |

PID 交互图表的所有数值来自 src/lib/pid.mjs 明示模型，默认基准来自原 examples/pid/simulate.py。React 内部 SVG 为本项目程序绘制。

原教材下载和外部视频只提供链接，不重新发布第三方素材。更多原仓库版权说明见 ../SOURCES.md。
