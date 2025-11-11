import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// 타입 지정
type GPS_SESSION = {
  session_id: string;
  start_time: string;
  end_time: string;
  total_distance: number;
};

type GPS_LOG = {
  latitude: number;
  longitude: number;
};

// 목업 세션
const mockSession: GPS_SESSION[] = [
  {
    session_id: 'S_AM_0830',
    start_time: '2025-11-09T08:30:00.000Z',
    end_time: '2025-11-09T11:00:00.000Z',
    total_distance: 6.5,
  },
  {
    session_id: 'S_PM_1930',
    start_time: '2025-11-09T19:30:00.000Z',
    end_time: '2025-11-09T21:00:00.000Z',
    total_distance: 4.8,
  },
];

// 목업 경로
const mockRoutes: Record<string, GPS_LOG[]> = {
  S_AM_0830: [
    { latitude: 35.1516, longitude: 128.9976 },
    { latitude: 35.1498, longitude: 128.998 },
    { latitude: 35.1485, longitude: 128.9984 },
    { latitude: 35.1483, longitude: 129.0018 },
    { latitude: 35.1485, longitude: 129.0035 },
    { latitude: 35.1505, longitude: 129.0033 },
    { latitude: 35.152, longitude: 129.0031 },
    { latitude: 35.1521, longitude: 129.001 },
    { latitude: 35.152, longitude: 128.9987 },
  ],
  S_PM_1930: [
    { latitude: 35.1516, longitude: 128.9976 },
    { latitude: 35.1498, longitude: 128.998 },
    { latitude: 35.1485, longitude: 128.9984 },
    { latitude: 35.1483, longitude: 129.0018 },
    { latitude: 35.1485, longitude: 129.0035 },
    { latitude: 35.1505, longitude: 129.0033 },
    { latitude: 35.152, longitude: 129.0031 },
    { latitude: 35.1521, longitude: 129.001 },
    { latitude: 35.152, longitude: 128.9987 },
  ],
};

function ActivityPage() {
  return (
    <View style={Style.container}>
      <Text>오늘의 운동</Text>
    </View>
  );
}

const Style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ActivityPage;
