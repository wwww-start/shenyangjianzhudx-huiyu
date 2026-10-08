#include "Motor.h"
#include "PWM.h"
#include <math.h>

static int8_t Motor_PreviousSign;
static uint8_t Motor_Ready;

void Motor_Stop(void)
{
    GPIO_ResetBits(GPIOB, GPIO_Pin_14); /* STBY 影响整个芯片。 */
    PWM_SetCompare(0);
    GPIO_ResetBits(GPIOB, GPIO_Pin_12 | GPIO_Pin_13);
    Motor_PreviousSign = 0;
}

uint8_t Motor_Init(void)
{
    GPIO_InitTypeDef gpio;
    Motor_Ready = 0;
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);
    GPIO_ResetBits(GPIOB, GPIO_Pin_12 | GPIO_Pin_13 | GPIO_Pin_14);
    GPIO_StructInit(&gpio);
    gpio.GPIO_Pin = GPIO_Pin_12 | GPIO_Pin_13 | GPIO_Pin_14;
    gpio.GPIO_Mode = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_2MHz;
    GPIO_Init(GPIOB, &gpio);
    if (PWM_GetTimerClock() != 72000000U)
    {
        return 0; /* 本例 PSC 0、ARR 3599 的前提，失败保持待机。 */
    }
    PWM_Init(0U, 3599U); /* 20 kHz，PA0 为 PWMA。 */
    Motor_Stop();
    Motor_Ready = 1;
    return 1;
}

/* 直接反转时先停止并拒绝本次请求；调用方必须安排实际减速等待。 */
uint8_t Motor_Set(float command)
{
    int8_t sign;
    uint16_t compare;
    if (!Motor_Ready)
    {
        return 0;
    }
    if (!isfinite(command))
    {
        Motor_Stop();
        return 0;
    }
    if (command > 1.0f)
    {
        command = 1.0f;
    }
    else if (command < -1.0f)
    {
        command = -1.0f;
    }
    sign = (int8_t)((command > 0.0f) - (command < 0.0f));
    if (sign == 0)
    {
        Motor_Stop();
        return 1;
    }
    if (Motor_PreviousSign != 0 && sign != Motor_PreviousSign)
    {
        Motor_Stop();
        return 0;
    }
    GPIO_WriteBit(GPIOB, GPIO_Pin_12, sign > 0 ? Bit_SET : Bit_RESET);
    GPIO_WriteBit(GPIOB, GPIO_Pin_13, sign > 0 ? Bit_RESET : Bit_SET);
    compare = (uint16_t)(fabsf(command) * (float)TIM2->ARR);
    PWM_SetCompare(compare);
    GPIO_SetBits(GPIOB, GPIO_Pin_14);
    Motor_PreviousSign = sign;
    return 1;
}
