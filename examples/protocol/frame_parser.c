#include "frame_parser.h"

int frame_push(FrameParser *parser, uint8_t byte, uint16_t *target)
{
    if (parser == NULL || target == NULL)
    {
        return 0;
    }
    if (parser->used < 4U)
    {
        parser->bytes[parser->used++] = byte;
    }
    else
    {
        for (size_t i = 0; i < 3U; ++i)
        {
            parser->bytes[i] = parser->bytes[i + 1U];
        }
        parser->bytes[3] = byte;
    }
    if (parser->used != 4U || parser->bytes[0] != 0xAAU)
    {
        return 0;
    }
    uint8_t checksum = (uint8_t)(parser->bytes[0]
        + parser->bytes[1] + parser->bytes[2]);
    uint16_t value = (uint16_t)((uint16_t)parser->bytes[1]
        | ((uint16_t)parser->bytes[2] << 8));
    if (checksum != parser->bytes[3] || value > 1000U)
    {
        return 0;
    }
    *target = value;
    parser->used = 0;
    return 1;
}
