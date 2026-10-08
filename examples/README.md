# 示例运行与工程集成

## 电脑端 C 示例

在仓库根目录使用支持 C11 的 GCC 编译。Windows PowerShell 运行生成的 `.exe`；Linux 等平台使用对应无扩展名程序。编译器需要自行准备，本文没有下载或安装工具链。

```sh
gcc -std=c11 -Wall -Wextra -Wpedantic examples/c_basics/main.c -o basics
gcc -std=c11 -Wall -Wextra -Wpedantic examples/c_basics/bit_flags.c -o flags
gcc -std=c11 -Wall -Wextra -Wpedantic examples/multi_file/main.c examples/multi_file/math_utils.c -o multi_file
gcc -std=c11 -Wall -Wextra -Wpedantic examples/protocol/main.c examples/protocol/frame_parser.c -o protocol
gcc -std=c11 -Wall -Wextra -Wpedantic examples/pid/main.c examples/pid/pid.c -lm -o pid_demo
gcc -std=c11 -Wall -Wextra -Wpedantic examples/state_machine/main.c -o fsm
gcc -std=c11 -Wall -Wextra -Wpedantic examples/stepper/step_count.c -lm -o step_count
```

| 程序 | 预期结果 |
| --- | --- |
| basics | mean=200，duty=25.0%，after=201 |
| flags | enabled=1 fault=1，然后 enabled=0 |
| multi_file | clamped=1.0 |
| protocol | target=300，然后 target=700 |
| pid_demo | 800 行仿真数据和 CSV 表头 |
| fsm | DISABLED RUNNING FAULT FAULT DISABLED |
| step_count | pulses=800，requested_rpm=30.0 |

PID C 程序把 CSV 写到标准输出。如需文件，在 PowerShell 使用 `./pid_demo.exe | Set-Content -Encoding utf8 pid_trace.csv`。这里的 gain 和 time_constant 是教学假设，不是电机实测参数。

Python 替代仿真：

```sh
python examples/pid/simulate.py
```

将在当前目录生成 `pid_trace.csv`，最终速度约 59.983，目标是 60。Python 与 C 是两个实现，运行 Python 不代表 C 工程或硬件验证通过。

## STM32F107 标准库模块

目录 `stm32_stdperiph` 按 User、Hardware、System 划分。先按讲义第六章建立 Keil SPL 最小工程，把选用的 .c 加入工程，并将三个目录加入头文件搜索路径。库、启动文件和板级时钟需自行准备，本文未分发第三方库。

`User/main.c` 演示 LED 闪灯：先 SystemCoreClockUpdate，再 Delay_Init，检查返回值后 LED_Init，最后循环调用 LED_Blink_Once。工程只能有一个 SysTick_Handler；若已有处理函数，合并逻辑，不能重复定义。

| 模块 | 配置与调用 |
| --- | --- |
| Delay | SysTick 提供 1 ms 时间基准；先 Delay_Init，再 Delay_ms 或 Delay_GetTick |
| LED | PC13 低电平点亮假设；先 LED_Init，再 LED_Blink_Once |
| Button | PB0 上拉输入，先 Button_Init，再周期调用 Button_Poll；依赖 Delay 与 LED |
| Timer | TIM3 1 kHz 更新中断；先设置 NVIC 优先级分组，再 Timer_Init，主循环读取 Timer_GetEvents |
| PWM | TIM2 CH1 PA0 复用推挽；PWM_Demo_Start 成功后循环 PWM_Demo_Poll；演示占空比最高 999/1000 |
| AD | PA1 ADC1 CH1；先 Delay_Init，再 AD_Init，检查 AD_ReadVoltage 返回值后使用结果 |
| Motor | TIM2 CH1 PA0，PB12 AIN1、PB13 AIN2、PB14 STBY；先 Motor_Init，成功后 Motor_Set |
| GPIOModes | 八种 GPIO 模式配置演示；复用输出还需要对应外设和映射配置 |

TIM2 的 PWM 示例与 Motor 模块占用相同外设，应分别运行。Motor_Init 要求 TIM2 时钟为 72 MHz，PSC 0、ARR 3599 产生 20 kHz；频率条件不满足会拒绝启动。STBY 影响整颗 TB6612，B 通道按模块说明保持不用。本例不是完整双电机驱动。

直接反向请求会停止并返回失败，调用者不能在下一行立即反转，应等待反馈衰减并安排反转过程。Motor_Set(0) 进入待机高阻。先检查供电与共地，再用小指令确认方向。GPIO 不提供电机功率。

ADC 示例包含校准和转换超时，需要持续运行的 SysTick，不能在禁止中断的环境使用这些超时逻辑。参考电压由调用者提供，不能把示例中的电压换算当作校准精度承诺。

这些代码未经过 Keil 编译与实机测试。步进 step_count.c 仅计算脉冲数量，不是接线固件；Arduino Blink 需选择实际板卡，并核对 LED_BUILTIN。AI 章节没有模型开发代码。
