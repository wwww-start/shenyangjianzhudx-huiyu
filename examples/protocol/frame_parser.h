#ifndef TRAINING_FRAME_PARSER_H
#define TRAINING_FRAME_PARSER_H
#include <stddef.h>
#include <stdint.h>

typedef struct

{
    uint8_t bytes[4];
    size_t used;
} FrameParser;

/* Returns 1 only when a valid 0..1000 command was found. */
int frame_push(FrameParser *parser, uint8_t byte, uint16_t *target);
#endif
