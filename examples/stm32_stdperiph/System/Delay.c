#include "Delay.h"

static volatile uint32_t Delay_Ticks;

uint8_t Delay_Init(void)
{
    Delay_Ticks = 0;
    if (SystemCoreClock < 1000U)
    {
        return 0;
    }
    return (SysTick_Config(SystemCoreClock / 1000U) == 0U);
}

uint32_t Delay_GetTick(void)
{
    return Delay_Ticks;
}

void Delay_ms(uint32_t ms)
{
    uint32_t start = Delay_GetTick();
    while ((uint32_t)(Delay_GetTick() - start) < ms)
    {
        /* 依赖 SysTick 中断持续运行。 */
    }
}

/* 若模板中已有此函数，应合并后只保留一个定义。 */
void SysTick_Handler(void)
{
    Delay_Ticks++;
}
