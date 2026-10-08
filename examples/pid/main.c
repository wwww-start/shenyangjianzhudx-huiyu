#include <stdio.h>
#include "pid.h"

int main(void)
{
    PID p;
    if (!pid_init(&p, 0.025f, 0.04f, 0.001f,
                  0.0f, 1.0f, 0.8f, 0.03f)) {
        return 1;
    }
    const float dt = 0.01f;
    float speed = 0.0f;
    puts("time,target,speed,output");
    for (int k = 0; k < 800; ++k)
    {
        float time = k * dt;
        float target = k >= 50 ? 60.0f : 0.0f;
        float u = pid_step(&p, target, speed, dt);
        float gain = k >= 400 ? 90.0f : 100.0f;
        printf("%.2f,%.2f,%.3f,%.4f\n", (double)time,
               (double)target, (double)speed, (double)u);
        speed += dt * (gain * u - speed) / 0.25f;
    }
    return 0;
}
