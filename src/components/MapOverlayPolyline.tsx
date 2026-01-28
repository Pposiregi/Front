import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polyline as SvgPolyline } from 'react-native-svg';
import type { LatLng } from '@shared-types/location';
import type { MapRegion } from '@shared-types/location';
type Props = {
  region: MapRegion;
  coordinates: LatLng[];
  width: number;
  height: number;
};
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
export const MapOverlayPolyline = ({
  region,
  coordinates,
  width,
  height,
}: Props) => {
  const { points, fallbackPoints } = useMemo(() => {
    if (coordinates.length === 0) {
      return { points: '', fallbackPoints: '' };
    }
    const latDelta = region.latitudeDelta || 0.0001;
    const lonDelta = region.longitudeDelta || 0.0001;
    const minLat = region.latitude - latDelta / 2;
    const minLon = region.longitude - lonDelta / 2;
    const mapped = coordinates.map(({ latitude, longitude }) => {
        const xRatio = clamp((longitude - minLon) / lonDelta, 0, 1);
        const yRatio = clamp((latitude - minLat) / latDelta, 0, 1);
        const x = xRatio * width;
        const y = height - yRatio * height;
        return { x, y };
      });

    const xs = mapped.map((p) => p.x);
    const ys = mapped.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const COLLAPSE_PX_THRESHOLD = 1;
    const FALLBACK_LINE_PX = 8;
    const isCollapsed =
      maxX - minX < COLLAPSE_PX_THRESHOLD &&
      maxY - minY < COLLAPSE_PX_THRESHOLD;

    if (isCollapsed) {
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const half = FALLBACK_LINE_PX / 2;
      const fallbackPoints = `${(cx - half).toFixed(2)},${(
        cy - half
      ).toFixed(2)} ${(cx + half).toFixed(2)},${(cy + half).toFixed(2)}`;
      return { points: '', fallbackPoints };
    }

    const points = mapped
      .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');
    return { points, fallbackPoints: '' };
  }, [
    coordinates,
    height,
    region.latitude,
    region.latitudeDelta,
    region.longitude,
    region.longitudeDelta,
    width,
  ]);
  const polylinePoints = points || fallbackPoints;
  if (!polylinePoints) {
    return null;
  }
  return (
    <Svg
      pointerEvents='none'
      style={StyleSheet.absoluteFill}
      width={width}
      height={height}
    >
      <SvgPolyline
        points={polylinePoints}
        stroke='#7450FF'
        strokeWidth={4}
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </Svg>
  );
};
export default MapOverlayPolyline;
