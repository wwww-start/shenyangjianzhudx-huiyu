#include <stdint.h>
#include <stdio.h>

#define MOTOR_ENABLED (UINT32_C(1) << 0)
#define MOTOR_FAULT   (UINT32_C(1) << 1)

int main(void)
{
    uint32_t flags = 0;
    flags |= MOTOR_ENABLED;
    flags |= MOTOR_FAULT;
    printf("enabled=%d fault=%d\n",
           (flags & MOTOR_ENABLED) != 0,
           (flags & MOTOR_FAULT) != 0);
    flags &= ~MOTOR_ENABLED;
    printf("enabled=%d\n", (flags & MOTOR_ENABLED) != 0);
    return 0;
}
