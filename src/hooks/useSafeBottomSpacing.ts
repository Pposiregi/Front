import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_TAB_BAR_HEIGHT = 60;
const TAB_BAR_CONTENT_BOTTOM_PADDING = 16;
const MIN_ANDROID_NAV_BAR_INSET = 24;
const DEFAULT_CONTENT_GAP = 24;

/**
 * Android 3-button navigation bar와 앱 하단 탭바가 컨텐츠를 가리지 않도록
 * 하단 여백 계산을 한곳에서 관리한다.
 *
 * 일부 Android 환경은 safe-area bottom을 0으로 돌려주면서 navigation bar가
 * 앱 위에 겹쳐 보일 수 있어 Android에서는 최소 보정값을 둔다.
 */
export const useSafeBottomSpacing = () => {
  const insets = useSafeAreaInsets();
  const bottomInset =
    Platform.OS === 'android'
      ? Math.max(insets.bottom, MIN_ANDROID_NAV_BAR_INSET)
      : insets.bottom;
  const tabBarHeight = BASE_TAB_BAR_HEIGHT + bottomInset;
  const tabBarPaddingBottom = TAB_BAR_CONTENT_BOTTOM_PADDING + bottomInset;

  return {
    bottomInset,
    tabBarHeight,
    tabBarPaddingBottom,
    contentBottomPadding: tabBarHeight + DEFAULT_CONTENT_GAP,
  };
};
