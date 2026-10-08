#ifndef TRAINING_PID_H
#define TRAINING_PID_H

typedef struct

{
    float kp, ki, kd;
    float output_min, output_max;
    float integral_limit, tau;
    float integral, derivative, previous_measurement;
    int has_previous;
} PID;

int pid_init(PID *p, float kp, float ki, float kd,
             float low, float high, float i_limit, float tau);
void pid_reset(PID *p);
float pid_step(PID *p, float target, float measurement, float dt);

#endif
