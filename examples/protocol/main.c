#include <stdio.h>
#include "frame_parser.h"

int main(void)
{
    const uint8_t stream[] = {
        0x12, 0x34,
        0xAA, 0x2C, 0x01, 0x00, /* Incorrect checksum. */
        0xAA, 0x2C, 0x01, 0xD7, /* 300. */
        0xAA, 0xBC, 0x02, 0x68  /* 700. */
    };
    FrameParser parser = {0};
    uint16_t target = 0;
    for (size_t i = 0; i < sizeof stream; ++i)
    {
        if (frame_push(&parser, stream[i], &target))
        {
            printf("target=%u\n", (unsigned)target);
        }
    }
    return 0;
}
