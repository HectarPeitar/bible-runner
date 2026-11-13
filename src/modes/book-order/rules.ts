// Every tuning number for Book Order lives here, so ticket 16 can set them by
// playing without touching anything else.

export const LIVES = 3;
export const LANES = 3;

/** The speed-curve version stored with every board; bumping it clears the boards. */
export const SPEED_CURVE = 1;

export const START_SPEED = 1;
export const SPEED_CEILING = 6;
export const SPEED_RAMP = 0.2;

/** Time a row takes to reach the player at Speed 1. */
export const ROW_TRAVEL_MS = 1400;

/** A correct pick climbs the Speed, decelerating toward the ceiling. */
export function climbSpeed(speed: number): number {
  return speed + (SPEED_CEILING - speed) * SPEED_RAMP;
}

/** How long this row takes to reach the player at the current Speed. */
export function rowTravelMs(speed: number): number {
  return ROW_TRAVEL_MS / speed;
}
