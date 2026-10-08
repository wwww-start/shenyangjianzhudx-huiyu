#include "PWM.h"
#include "Delay.h"

static uint32_t PWM_LastUpdate;
static int32_t PWM_Compare;
static int32_t PWM_Increment;
static uint8_t PWM_DemoReady;

uint32_t PWM_GetTimerClock(void)
{
    RCC_ClocksTypeDef clocks;
    RCC_GetClocksFreq(&clocks);
    return clocks.PCLK1_Frequency == clocks.HCLK_Frequency
        ? clocks.PCLK1_Frequency : clocks.PCLK1_Frequency * 2U;
}

void PWM_Init(uint16_t psc, uint16_t arr)
{
    GPIO_InitTypeDef gpio;
    TIM_TimeBaseInitTypeDef tim;
    TIM_OCInitTypeDef oc;
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);
    TIM_Cmd(TIM2, DISABLE);
    GPIO_StructInit(&gpio);
    gpio.GPIO_Pin = GPIO_Pin_0;
    gpio.GPIO_Mode = GPIO_Mode_AF_PP;
    gpio.GPIO_Speed = GPIO_Speed_2MHz;
    GPIO_Init(GPIOA, &gpio);
    TIM_TimeBaseStructInit(&tim);
    tim.TIM_Prescaler = psc;
    tim.TIM_Period = arr;
    tim.TIM_CounterMode = TIM_CounterMode_Up;
    tim.TIM_ClockDivision = TIM_CKD_DIV1;
    TIM_TimeBaseInit(TIM2, &tim);
    TIM_OCStructInit(&oc);
    oc.TIM_OCMode = TIM_OCMode_PWM1;
    oc.TIM_OutputState = TIM_OutputState_Enable;
    oc.TIM_Pulse = 0;
    oc.TIM_OCPolarity = TIM_OCPolarity_High;
    TIM_OC1Init(TIM2, &oc);
    TIM_OC1PreloadConfig(TIM2, TIM_OCPreload_Enable);
    TIM_ARRPreloadConfig(TIM2, ENABLE);
    TIM_GenerateEvent(TIM2, TIM_EventSource_Update);
    TIM_SetCounter(TIM2, 0);
    TIM_Cmd(TIM2, ENABLE);
}

void PWM_SetCompare(uint16_t compare)
{
    uint16_t limit = (uint16_t)TIM2->ARR;
    if (compare > limit)
    {
        compare = limit;
    }
    TIM_SetCompare1(TIM2, compare);
}

/* 呼吸灯：计数频率 1 MHz，ARR 999，因此 PWM 为 1 kHz。 */
uint8_t PWM_Demo_Start(void)
{
    uint32_t clock = PWM_GetTimerClock();
    PWM_DemoReady = 0;
    if (clock < 1000000U || clock % 1000000U != 0U
        || clock / 1000000U > 65536U)
    {
        return 0;
    }
    PWM_Init((uint16_t)(clock / 1000000U - 1U), 999U);
    PWM_Compare = 0;
    PWM_Increment = 10;
    PWM_LastUpdate = Delay_GetTick();
    PWM_DemoReady = 1;
    return 1;
}

void PWM_Demo_Poll(void)
{
    uint32_t now = Delay_GetTick();
    if (!PWM_DemoReady || (uint32_t)(now - PWM_LastUpdate) < 20U)
    {
        return;
    }
    PWM_LastUpdate = now;
    PWM_Compare += PWM_Increment;
    if (PWM_Compare >= 999)
    {
        PWM_Compare = 999;
        PWM_Increment = -10;
    }
    else if (PWM_Compare <= 0)
    {
        PWM_Compare = 0;
        PWM_Increment = 10;
    }
    PWM_SetCompare((uint16_t)PWM_Compare);
}
