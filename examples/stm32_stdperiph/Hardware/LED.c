#include "LED.h"
#include "Delay.h"

/* 教学接线：PC13 接低电平点亮的限流 LED，核对板卡与引脚限制。 */
void LED_Init(void)
{
    GPIO_InitTypeDef gpio;
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC, ENABLE);
    GPIO_SetBits(GPIOC, GPIO_Pin_13); /* 初始熄灭。 */
    GPIO_StructInit(&gpio);
    gpio.GPIO_Pin = GPIO_Pin_13;
    gpio.GPIO_Mode = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_2MHz;
    GPIO_Init(GPIOC, &gpio);
}

void LED_Toggle(void)
{
    GPIO_WriteBit(GPIOC, GPIO_Pin_13,
        GPIO_ReadOutputDataBit(GPIOC, GPIO_Pin_13) ? Bit_RESET : Bit_SET);
}

void LED_Blink_Once(void)
{
    LED_Toggle();
    Delay_ms(500U);
}
