#include "Button.h"
#include "LED.h"
#include "Delay.h"

static uint8_t Button_LastRaw;
static uint8_t Button_Stable;
static uint32_t Button_ChangedAt;

void Button_Init(void)
{
    GPIO_InitTypeDef gpio;
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);
    GPIO_StructInit(&gpio);
    gpio.GPIO_Pin = GPIO_Pin_0;
    gpio.GPIO_Mode = GPIO_Mode_IPU; /* 按键另一端接地。 */
    GPIO_Init(GPIOB, &gpio);
    Button_LastRaw = GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_0);
    Button_Stable = Button_LastRaw;
    Button_ChangedAt = Delay_GetTick();
}

void Button_Poll(void)
{
    uint32_t now = Delay_GetTick();
    uint8_t raw = GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_0);
    if (raw != Button_LastRaw)
    {
        Button_LastRaw = raw;
        Button_ChangedAt = now;
    }
    if ((uint32_t)(now - Button_ChangedAt) >= 20U && raw != Button_Stable)
    {
        Button_Stable = raw;
        if (raw == 0U)
        {
            LED_Toggle();
        }
    }
}
