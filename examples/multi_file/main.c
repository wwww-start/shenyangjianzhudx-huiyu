#include <stdio.h>
#include "math_utils.h"

int main(void)
{
    float result = clamp_value(1.5f, -1.0f, 1.0f);
    printf("clamped=%.1f\n", (double)result);
    return 0;
}
