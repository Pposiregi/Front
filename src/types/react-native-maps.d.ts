declare module 'react-native-maps' {
  import * as React from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  export type LatLng = {
    latitude: number;
    longitude: number;
  };

  export type Region = LatLng & {
    latitudeDelta: number;
    longitudeDelta: number;
  };

  export interface MapViewProps extends ViewProps {
    initialRegion?: Region;
    region?: Region;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    provider?: 'google' | 'default';
    style?: StyleProp<ViewStyle>;
  }

  export default class MapView extends React.Component<MapViewProps> {
    animateCamera?: (camera: { center: LatLng }) => void;
    animateToRegion?: (region: Region, duration?: number) => void;
  }

  export interface PolylineProps {
    coordinates: LatLng[];
    strokeColor?: string;
    strokeWidth?: number;
  }

  export class Polyline extends React.Component<PolylineProps> {}

  export interface MarkerProps {
    coordinate: LatLng;
  }

  export class Marker extends React.Component<MarkerProps> {}

  export const PROVIDER_GOOGLE: 'google';
}
