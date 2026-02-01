import ActivityDetailPage from '@pages/activity/activityDetail/ActivityDetailPage';
import ActivityPage from '@pages/activity/ActivityPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ActivityStackParamList = {
  ActivityPage: undefined;
  ActivityDetailPage: {
    sessionId: string;
  };
};
const Stack = createNativeStackNavigator<ActivityStackParamList>();
const ActivityStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ActivityPage'
        component={ActivityPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ActivityDetailPage'
        component={ActivityDetailPage}
        options={{ headerShown: true, title: '이렇게 달렸어요!' }}
      />
    </Stack.Navigator>
  );
};

export default ActivityStack;
