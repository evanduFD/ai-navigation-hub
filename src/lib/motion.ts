/**
 * Shared easing — gentle start, long settle.
 *
 * Deliberately not an expo-out: that curve covers ~80% of its distance in the
 * first quarter of its duration, so it reads as snappy however long you make it.
 * A slight ease-in makes the movement feel unhurried instead.
 */
export const EASE_SMOOTH: [number, number, number, number] = [0.4, 0, 0.22, 1]

/** Entrance reveals — slow and cinematic. */
export const ENTER = { duration: 0.75, ease: EASE_SMOOTH }

/** Filtering and dismissals stay quicker, so the UI never feels sluggish to use. */
export const EXIT = { duration: 0.25, ease: EASE_SMOOTH }
