#ifndef DELAY_H
#define DELAY_H

#include "stm32f10x.h"

/* 初始化毫秒计时，成功返回 1。调用前更新 SystemCoreClock。 */
uint8_t Delay_Init(void);
uint32_t Delay_GetTick(void);
/* 阻塞等待；仅用于主循环的基础演示，不能在中断中调用。 */
void Delay_ms(uint32_t ms);

#endif
