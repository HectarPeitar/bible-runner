// Every tuning number for Book Order lives here, so ticket 16 can set them by
// playing without touching anything else.

export const LANES = 3;

/** The speed-curve version stored with every board; bumping it clears the boards. */
export const SPEED_CURVE = 1;

export const START_SPEED = 1;

/** The Speed a Run starts at when it accepts a Start boost: a playtest number, like the ramp. */
export const START_BOOST_SPEED = 3;

export const SPEED_CEILING = 6;
export const SPEED_RAMP = 0.2;

/** World units between Rows on the road. */
export const ROW_SPACING = 2000;

/** Rows on the road at once, all of them ahead of the Runner. */
export const ROWS_ON_ROAD = 4;

/** World distance from the Runner to the farthest Row. */
export const SPAWN_Z = ROW_SPACING * ROWS_ON_ROAD;

/** Time a Row takes to travel the whole road at Speed 1. */
export const ROW_TRAVEL_MS = 12_000;

/** How much the world slows while a Stumble is being corrected, for a beat. */
export const STUMBLE_SLOWDOWN = 0.5;

/** How far back along the road a Stumble pushes the Runner, in world units. */
export const STUMBLE_PUSH_BACK = ROW_SPACING / 4;

/** A correct arrival climbs the Speed, decelerating toward the ceiling. */
export function climbSpeed(speed: number): number {
  return speed + (SPEED_CEILING - speed) * SPEED_RAMP;
}

/** How long a Row takes to travel the whole road at the current Speed. */
export function rowTravelMs(speed: number): number {
  return ROW_TRAVEL_MS / speed;
}

/** How long between one Row arriving and the next, at the current Speed. */
export function rowIntervalMs(speed: number): number {
  return rowTravelMs(speed) / ROWS_ON_ROAD;
}
