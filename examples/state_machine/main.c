#include <stdbool.h>
#include <stdio.h>

typedef enum { DISABLED, RUNNING, FAULT } State;

static State update(State current, bool enable,
                    bool command_fresh, bool sensor_ok, bool reset)
{
    if (!command_fresh || !sensor_ok)
    {
        return FAULT;
    }
    if (current == FAULT)
    {
        return reset && !enable ? DISABLED : FAULT;
    }
    return enable ? RUNNING : DISABLED;
}

int main(void)
{
    const char *names[] = {"DISABLED", "RUNNING", "FAULT"};
    State state = DISABLED;
    puts(names[state]);
    state = update(state, true, true, true, false);
    puts(names[state]);
    state = update(state, true, false, true, false);
    puts(names[state]);
    state = update(state, true, true, true, false);
    puts(names[state]);
    state = update(state, false, true, true, true);
    puts(names[state]);
    return 0;
}
