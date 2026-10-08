#ifndef AD_H
#define AD_H

#include "stm32f10x.h"

/* PA1 为 ADC1 通道 1。成功返回 1，失败返回 0。 */
uint8_t AD_Init(void);
/* vref 单位 V；成功时将电压写入 voltage。 */
uint8_t AD_ReadVoltage(float vref, float *voltage);

#endif
