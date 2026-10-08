#ifndef TRAINING_MOTOR_STATE_H
#define TRAINING_MOTOR_STATE_H
#include <stdbool.h>

typedef struct

{
    float target_rpm;
    float measured_rpm;
    bool enabled;
} MotorState;

#endif
