import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@styles/Activity.styles';
import type {
  ActivityDetailNavigationProp,
  GPS_SESSION,
} from '../../types/activity';

type SessionItemProps = {
  session: GPS_SESSION;
};

function SessionItem({ session }: SessionItemProps) {
  const navigation = useNavigation<ActivityDetailNavigationProp>();

  const formattedDate = useMemo(
    () =>
      new Date(session.start_time)
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, '/'),
    [session.start_time]
  );

  const timeRange = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return `${new Date(session.start_time).toLocaleTimeString(
      [],
      options
    )} - ${new Date(session.end_time).toLocaleTimeString([], options)}`;
  }, [session.start_time, session.end_time]);

  const handlePress = () => {
    navigation.navigate('ActivityDetailPage', {
      sessionId: session.session_id,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
      <Text style={styles.indexText}>🚩</Text>
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.timeText}>{timeRange}</Text>
      </View>
      <Text style={styles.distanceText}>
        {session.total_distance.toFixed(2)} km
      </Text>
      <Text style={styles.detailLink}> &gt;</Text>
    </TouchableOpacity>
  );
}

export default SessionItem;
