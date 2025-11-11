import ActivityDetailPage from '@pages/activity/ActivityDetailPage';
import ActivityPage from '@pages/activity/ActivityPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

export type ActivityStackParamList = {
  ActivityPage: undefined;
  ActivityDetailPage: undefined;
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default activityStack;
