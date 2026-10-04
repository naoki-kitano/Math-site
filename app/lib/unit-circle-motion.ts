export type Point = readonly [number, number];
export const originalTriangle = {
  origin: [0, 0] as Point,
  foot: [-0.5, 0] as Point,
  point: [-0.5, -Math.sqrt(3) / 2] as Point,
};

// A single rigid rotation of all three vertices preserves each side.
// Intermediate sides need not be parallel to the coordinate axes.
export function rotateClockwise([x, y]: Point, degrees: number): Point {
  const angle = degrees * Math.PI / 180;
  return [x * Math.cos(angle) + y * Math.sin(angle), -x * Math.sin(angle) + y * Math.cos(angle)];
}
