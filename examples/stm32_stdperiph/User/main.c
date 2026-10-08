#include "stm32f10x.h"
#include "Delay.h"
#include "LED.h"

int main(void)
{
    SystemCoreClockUpdate();
    if (!Delay_Init())
    {
        while (1)
        {
            /* 计时配置失败；在此设置断点，核对系统时钟。 */
        }
    }
    LED_Init();
    while (1)
    {
        LED_Blink_Once();
    }
}
