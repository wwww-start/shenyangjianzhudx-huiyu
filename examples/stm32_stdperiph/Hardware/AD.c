#include "AD.h"
#include "Delay.h"
#include <math.h>
#include <stddef.h>

static uint8_t AD_Ready;

uint8_t AD_Init(void)
{
    GPIO_InitTypeDef gpio;
    ADC_InitTypeDef adc;
    RCC_ClocksTypeDef clocks;
    uint32_t start;
    AD_Ready = 0;
    RCC_GetClocksFreq(&clocks);
    if (clocks.PCLK2_Frequency / 6U > 14000000U)
    {
        return 0;
    }
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_ADC1, ENABLE);
    RCC_ADCCLKConfig(RCC_PCLK2_Div6);
    GPIO_StructInit(&gpio);
    gpio.GPIO_Pin = GPIO_Pin_1;
    gpio.GPIO_Mode = GPIO_Mode_AIN;
    GPIO_Init(GPIOA, &gpio);
    ADC_StructInit(&adc);
    adc.ADC_Mode = ADC_Mode_Independent;
    adc.ADC_ScanConvMode = DISABLE;
    adc.ADC_ContinuousConvMode = DISABLE;
    adc.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None;
    adc.ADC_DataAlign = ADC_DataAlign_Right;
    adc.ADC_NbrOfChannel = 1;
    ADC_Init(ADC1, &adc);
    ADC_RegularChannelConfig(ADC1, ADC_Channel_1, 1, ADC_SampleTime_239Cycles5);
    ADC_Cmd(ADC1, ENABLE);
    Delay_ms(1U); /* 等待上电稳定；计时必须已经初始化。 */
    ADC_ResetCalibration(ADC1);
    start = Delay_GetTick();
    while (ADC_GetResetCalibrationStatus(ADC1) == SET)
    {
        if ((uint32_t)(Delay_GetTick() - start) >= 10U)
        {
            return 0;
        }
    }
    ADC_StartCalibration(ADC1);
    start = Delay_GetTick();
    while (ADC_GetCalibrationStatus(ADC1) == SET)
    {
        if ((uint32_t)(Delay_GetTick() - start) >= 10U)
        {
            return 0;
        }
    }
    AD_Ready = 1;
    return 1;
}

uint8_t AD_ReadVoltage(float vref, float *voltage)
{
    uint32_t start;
    uint16_t raw;
    if (!AD_Ready || voltage == NULL || !isfinite(vref) || vref <= 0.0f)
    {
        return 0;
    }
    ADC_ClearFlag(ADC1, ADC_FLAG_EOC);
    ADC_SoftwareStartConvCmd(ADC1, ENABLE);
    start = Delay_GetTick();
    while (ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC) == RESET)
    {
        if ((uint32_t)(Delay_GetTick() - start) >= 10U)
        {
            ADC_Cmd(ADC1, DISABLE);
            AD_Ready = 0; /* 超时后重新初始化，避免混用迟到结果。 */
            return 0;
        }
    }
    raw = ADC_GetConversionValue(ADC1);
    *voltage = (float)raw * vref / 4095.0f;
    return 1;
}
