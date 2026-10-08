#ifndef BUTTON_H
#define BUTTON_H

#include "stm32f10x.h"

void Button_Init(void);
/* 主循环反复调用；每次稳定按下只翻转一次 LED。 */
void Button_Poll(void);

#endif
