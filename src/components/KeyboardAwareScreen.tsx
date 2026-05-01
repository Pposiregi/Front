import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '@styles/theme';
import { SCREEN_HEIGHT } from '@styles/dimensions';

type KeyboardAwareScreenProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  extraScrollHeight?: number;
};

type KeyboardAwareModalContentProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * 폼 화면에서 키보드가 입력창을 가리지 않도록 하는 공통 스크롤 설정.
 *
 * 기존에는 각 화면에서 KeyboardAwareScrollView와 ScrollView를 중첩해서 사용했는데,
 * 중첩 스크롤 구조에서는 포커스된 TextInput 위치 계산이 어긋날 수 있다.
 * 그래서 일반 입력 화면은 이 컴포넌트 하나만 스크롤 컨테이너로 사용한다.
 */
const defaultScreenContentStyle = {
  flexGrow: 1,
  backgroundColor: Colors.background,
  // 마지막 입력창과 하단 버튼이 숫자 키보드 위로 올라올 수 있도록 공통 여백을 둔다.
  paddingBottom: SCREEN_HEIGHT * 0.18,
};

/** 회원가입/설정 같은 전체 화면 입력 폼에서 사용하는 키보드 대응 래퍼. */
export const KeyboardAwareScreen = ({
  children,
  contentContainerStyle,
  extraScrollHeight = 100,
}: KeyboardAwareScreenProps) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={extraScrollHeight}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={[defaultScreenContentStyle, contentContainerStyle]}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

/**
 * Modal 내부 입력 폼에서 사용하는 키보드 대응 래퍼.
 *
 * Modal은 일반 화면과 달리 부모 navigation 영역의 키보드 회피 처리를 받지 못한다.
 * 따라서 KeyboardAvoidingView로 카드 위치를 보정하고, ScrollView로 작은 화면에서도
 * 하단 입력/버튼까지 직접 스크롤해서 확인할 수 있게 한다.
 */
export const KeyboardAwareModalContent = ({
  children,
  contentContainerStyle,
}: KeyboardAwareModalContentProps) => {
  return (
    <KeyboardAvoidingView
      style={styles.modalKeyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.modalScroll}
        contentContainerStyle={[
          styles.modalScrollContent,
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalKeyboardAvoiding: {
    flex: 1,
  },
  modalScroll: {
    flex: 1,
    width: '100%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
});
