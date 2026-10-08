#include <math.h>
#include <stdio.h>

int main(void)
{
    const double step_angle_deg = 1.8;
    const unsigned microsteps = 16;
    const double requested_angle_deg = 90.0;
    const double step_frequency_hz = 1600.0;
    double steps_per_rev = 360.0 / step_angle_deg * microsteps;
    long pulses = lround(requested_angle_deg / 360.0 * steps_per_rev);
    double rpm = step_frequency_hz * 60.0 / steps_per_rev;
    printf("pulses=%ld\n", pulses);
    printf("requested_rpm=%.1f\n", rpm);
    return 0;
}
