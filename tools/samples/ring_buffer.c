/**
 * @file ring_buffer.c
 * @brief Fixed-size ring buffer.
 * @param capacity must be a power of two
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include "ring_buffer.h"

#define RB_CAPACITY 0x100u
#define RB_MASK (RB_CAPACITY - 1)
#define RB_LOG(fmt, ...) fprintf(stderr, "[rb] " fmt "\n", __VA_ARGS__)

#ifndef NDEBUG
#  define ASSERT(x) do { if (!(x)) abort(); } while (0)
#else
#  define ASSERT(x) ((void)0)
#endif

typedef enum { RB_OK = 0, RB_FULL, RB_EMPTY } rb_status;

typedef struct ring_buffer {
    uint8_t *data;
    size_t head, tail;
    volatile bool locked;
} ring_buffer_t;

static const double LOAD_FACTOR = 0.75e0;
extern int verbose;

ring_buffer_t *rb_create(size_t capacity) {
    ring_buffer_t *rb = malloc(sizeof *rb);
    if (rb == NULL) return NULL;
    rb->data = calloc(capacity, sizeof(uint8_t));
    rb->head = rb->tail = 0;
    rb->locked = false;
    return rb;
}

rb_status rb_push(ring_buffer_t *rb, uint8_t byte) {
    if (((rb->head + 1) & RB_MASK) == rb->tail) {
        RB_LOG("full at %zu (%c)", rb->head, 'x');
        return RB_FULL;
    }
    rb->data[rb->head++ & RB_MASK] = byte;
    return RB_OK;
}

int main(int argc, char **argv) {
    ring_buffer_t *rb = rb_create(RB_CAPACITY);
    unsigned long total = 0UL;
    for (int i = 0; i < argc && i < 010; ++i) {
        switch (rb_push(rb, (uint8_t)argv[i][0])) {
        case RB_FULL: goto done;
        default: total += (unsigned long)i << 2; break;
        }
    }
done:
    printf("total=%lu load=%.2f\t%s\n", total, LOAD_FACTOR, verbose ? "yes" : "no");
    free(rb->data);
    free(rb);
    return EXIT_SUCCESS;
}
