#ifndef PWM_H
#define PWM_H

#include "stm32f10x.h"

/* 配置 TIM2 CH1 默认 PA0；PSC、ARR 都是寄存器值。 */
void PWM_Init(uint16_t psc, uint16_t arr);
/* 获取当前配置下 APB1 定时器输入时钟，单位 Hz。 */
uint32_t PWM_GetTimerClock(void);
/* CCR 限制到 ARR，教学代码不采用满占空比的特殊表示。 */
void PWM_SetCompare(uint16_t compare);
uint8_t PWM_Demo_Start(void);
void PWM_Demo_Poll(void);

#endif
