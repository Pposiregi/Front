import {
  calculateTotalDistanceMeters,
  calculateTotalSlopeDistanceMeters,
  getDistanceMeters,
  getSlopeDistanceMeters,
  type AltitudePoint,
} from '../src/utils/distance';

const pointAtLatitudeOffset = (
  base: AltitudePoint,
  metersNorth: number,
  altitude?: number
): AltitudePoint => ({
  latitude: base.latitude + metersNorth / 111_320,
  longitude: base.longitude,
  altitude,
});

describe('distance utilities', () => {
  const origin: AltitudePoint = {
    latitude: 37.5665,
    longitude: 126.978,
    altitude: 20,
  };

  it('keeps 3D distance equal to 2D distance when altitude is unchanged', () => {
    const next = pointAtLatitudeOffset(origin, 100, 20);

    expect(getSlopeDistanceMeters(origin, next)).toBeCloseTo(
      getDistanceMeters(origin, next),
      6
    );
  });

  it('adds valid vertical distance with the Pythagorean formula', () => {
    const next = pointAtLatitudeOffset(origin, 100, 30);
    const horizontalDistance = getDistanceMeters(origin, next);

    expect(getSlopeDistanceMeters(origin, next)).toBeCloseTo(
      Math.hypot(horizontalDistance, 10),
      6
    );
  });

  it('falls back to 2D distance when altitude is missing', () => {
    const next = pointAtLatitudeOffset(origin, 100);

    expect(getSlopeDistanceMeters(origin, next)).toBeCloseTo(
      getDistanceMeters(origin, next),
      6
    );
  });

  it('falls back to 2D distance for unrealistic short-segment altitude jumps', () => {
    const next = pointAtLatitudeOffset(origin, 1, 30);

    expect(getSlopeDistanceMeters(origin, next)).toBeCloseTo(
      getDistanceMeters(origin, next),
      6
    );
  });

  it('falls back to 2D distance when altitude accuracy is too low', () => {
    const next = {
      ...pointAtLatitudeOffset(origin, 100, 30),
      altitudeAccuracy: 25,
    };

    expect(getSlopeDistanceMeters(origin, next)).toBeCloseTo(
      getDistanceMeters(origin, next),
      6
    );
  });

  it('sums 3D segments across a path', () => {
    const middle = pointAtLatitudeOffset(origin, 100, 30);
    const end = pointAtLatitudeOffset(origin, 200, 20);
    const expected =
      getSlopeDistanceMeters(origin, middle) +
      getSlopeDistanceMeters(middle, end);

    expect(
      calculateTotalSlopeDistanceMeters([origin, middle, end])
    ).toBeCloseTo(expected, 6);
    expect(
      calculateTotalSlopeDistanceMeters([origin, middle, end])
    ).toBeGreaterThan(calculateTotalDistanceMeters([origin, middle, end]));
  });
});
