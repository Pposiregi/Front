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
  const points = useMemo(() => {
    if (coordinates.length < 2) {
      return '';
    }
    const latDelta = region.latitudeDelta || 0.0001;
    const lonDelta = region.longitudeDelta || 0.0001;
    const minLat = region.latitude - latDelta / 2;
    const minLon = region.longitude - lonDelta / 2;
    return coordinates
      .map(({ latitude, longitude }) => {
        const xRatio = clamp((longitude - minLon) / lonDelta, 0, 1);
        const yRatio = clamp((latitude - minLat) / latDelta, 0, 1);
        const x = xRatio * width;
        const y = height - yRatio * height;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [
    coordinates,
    height,
    region.latitude,
    region.latitudeDelta,
    region.longitude,
    region.longitudeDelta,
    width,
  ]);
  if (!points) {
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
        points={points}
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
