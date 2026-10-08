#ifndef MOTOR_H
#define MOTOR_H

#include "stm32f10x.h"

/* A 通道 TB6612，成功返回 1。要求 TIM2 时钟为 72 MHz。 */
uint8_t Motor_Init(void);
/* 输出归一化指令 -1 到 1，不代表 RPM；失败返回 0。 */
uint8_t Motor_Set(float command);
/* STBY 拉低使两通道均待机，电机输出高阻。 */
void Motor_Stop(void);

#endif
