import ActivityDetailPage from '@pages/activity/activityDetail/ActivityDetailPage';
import ActivityPage from '@pages/activity/ActivityPage';
import { Colors, Fonts, Typography } from '@styles/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ActivityStackParamList = {
  ActivityPage: undefined;
  ActivityDetailPage: {
    sessionId: string;
  };
};

/**
 * 활동 탭 네비게이션 스택.
 */
const Stack = createNativeStackNavigator<ActivityStackParamList>();

/**
 * Activity 스택을 렌더링한다.
 */
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
        options={{
          headerShown: true,
          title: '이렇게 달렸어요!',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontFamily: Fonts.Pretendard,
            fontSize: Typography.cardTitle,
            fontWeight: '700',
            color: Colors.textPrimary,
          },
          headerTintColor: Colors.textPrimary,
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default ActivityStack;
