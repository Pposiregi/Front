import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import ProfilePage from '@pages/ProfilePage';
import ProfileSettingPage from '@pages/ProfileSettingPage';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileSettings: undefined;
};

export type ProfileStackNavigationProp<T extends keyof ProfileStackParamList> =
  NativeStackNavigationProp<ProfileStackParamList, T>;

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ProfileMain'
        component={ProfilePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ProfileSettings'
        component={ProfileSettingPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
