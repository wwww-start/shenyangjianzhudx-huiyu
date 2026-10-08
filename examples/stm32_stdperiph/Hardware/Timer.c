#include "Timer.h"

static volatile uint32_t Timer_Events;

/* TIM3 产生 1 kHz 更新中断；实际 TIM3 时钟由 APB1 配置决定。 */
uint8_t Timer_Init(void)
{
    RCC_ClocksTypeDef clocks;
    TIM_TimeBaseInitTypeDef tim;
    NVIC_InitTypeDef nvic;
    uint32_t timer_clock;
    RCC_GetClocksFreq(&clocks);
    timer_clock = clocks.PCLK1_Frequency;
    if (clocks.PCLK1_Frequency != clocks.HCLK_Frequency)
    {
        timer_clock *= 2U;
    }
    if (timer_clock < 1000000U || timer_clock % 1000000U != 0U
        || timer_clock / 1000000U > 65536U)
    {
        return 0;
    }
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE);
    TIM_TimeBaseStructInit(&tim);
    tim.TIM_Prescaler = (uint16_t)(timer_clock / 1000000U - 1U);
    tim.TIM_Period = 999U;
    tim.TIM_CounterMode = TIM_CounterMode_Up;
    tim.TIM_ClockDivision = TIM_CKD_DIV1;
    TIM_TimeBaseInit(TIM3, &tim);
    Timer_Events = 0;
    TIM_ClearITPendingBit(TIM3, TIM_IT_Update);
    nvic.NVIC_IRQChannel = TIM3_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 1;
    nvic.NVIC_IRQChannelSubPriority = 0;
    nvic.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&nvic); /* 主工程先统一设置 NVIC 优先级分组。 */
    TIM_ITConfig(TIM3, TIM_IT_Update, ENABLE);
    TIM_Cmd(TIM3, ENABLE);
    return 1;
}

uint32_t Timer_GetEvents(void)
{
    return Timer_Events;
}

void TIM3_IRQHandler(void)
{
    if (TIM_GetITStatus(TIM3, TIM_IT_Update) == SET)
    {
        TIM_ClearITPendingBit(TIM3, TIM_IT_Update);
        Timer_Events++;
    }
}
