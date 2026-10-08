#ifndef TIMER_H
#define TIMER_H

#include "stm32f10x.h"

uint8_t Timer_Init(void);
/* 返回累计中断次数；不执行“读取并清零”。 */
uint32_t Timer_GetEvents(void);

#endif
