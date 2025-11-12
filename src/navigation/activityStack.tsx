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
const activityStack = () => {
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
        options={{ headerShown: true, title: '활동 상세 정보' }}
      />
    </Stack.Navigator>
  );
};

export default activityStack;
