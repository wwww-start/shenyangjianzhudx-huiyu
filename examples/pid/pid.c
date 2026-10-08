#include "pid.h"
#include <math.h>
#include <stddef.h>

static float clamp(float value, float low, float high)
{
    if (value < low) return low;
    if (value > high) return high;
    return value;
}

void pid_reset(PID *p)
{
    if (p == NULL) return;
    p->integral = 0.0f;
    p->derivative = 0.0f;
    p->previous_measurement = 0.0f;
    p->has_previous = 0;
}

int pid_init(PID *p, float kp, float ki, float kd,
             float low, float high, float i_limit, float tau)
{
    if (p == NULL || !isfinite(kp) || !isfinite(ki)
        || !isfinite(kd) || !isfinite(low) || !isfinite(high)
        || !isfinite(i_limit) || !isfinite(tau)
        || kp < 0 || ki < 0 || kd < 0 || low > high
        || i_limit < 0 || tau < 0) {
        return 0;
    }
    p->kp = kp; p->ki = ki; p->kd = kd;
    p->output_min = low; p->output_max = high;
    p->integral_limit = i_limit; p->tau = tau;
    pid_reset(p);
    return 1;
}

/* Precondition: p was successfully initialized and not corrupted.
 * Returns zero for invalid runtime inputs; application must also
 * detect sensor faults and enforce its own safe output state.
 */
float pid_step(PID *p, float target, float measurement, float dt)
{
    if (p == NULL || !isfinite(target) || !isfinite(measurement)
        || !isfinite(dt) || dt <= 0.0f) {
        return 0.0f;
    }
    float error = target - measurement;
    float raw_d = 0.0f;
    if (p->has_previous)
    {
        raw_d = -p->kd * (measurement - p->previous_measurement) / dt;
    }
    float alpha = dt / (p->tau + dt);
    float derivative = p->derivative + alpha * (raw_d - p->derivative);
    float next_i = clamp(p->integral + p->ki * error * dt,
                         -p->integral_limit, p->integral_limit);
    float trial = p->kp * error + next_i + derivative;
    if (!isfinite(error) || !isfinite(derivative)
        || !isfinite(next_i) || !isfinite(trial)) {
        pid_reset(p);
        return 0.0f;
    }
    int drives_high = trial > p->output_max && error > 0.0f;
    int drives_low = trial < p->output_min && error < 0.0f;
    if (!drives_high && !drives_low)
    {
        p->integral = next_i;
    }
    p->derivative = derivative;
    p->previous_measurement = measurement;
    p->has_previous = 1;
    float output = p->kp * error + p->integral + derivative;
    if (!isfinite(output))
    {
        pid_reset(p);
        return 0.0f;
    }
    return clamp(output, p->output_min, p->output_max);
}
