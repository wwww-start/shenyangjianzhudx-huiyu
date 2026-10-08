#include <stddef.h>
#include <stdio.h>

static int mean(const int *data, size_t length)
{
    int sum = 0;
    if (data == NULL || length == 0U)
    {
        return 0;
    }
    for (size_t i = 0; i < length; ++i)
    {
        sum += data[i]; /* Teaching input is small enough for int. */
    }
    return sum / (int)length;
}

static void increment(int *value)
{
    if (value != NULL)
    {
        *value += 1;
    }
}

int main(void)
{
    const int samples[] = {100, 200, 300, 200};
    const size_t length = sizeof samples / sizeof samples[0];
    int result = mean(samples, length);
    const float duty = 250.0f / 1000.0f;
    printf("mean=%d count=%zu\n", result, length);
    printf("duty=%.1f%%\n", (double)(duty * 100.0f));
    increment(&result);
    printf("after=%d\n", result);
    return 0;
}
