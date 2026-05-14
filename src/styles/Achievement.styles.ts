import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts, Typography } from './theme';

export const styles = StyleSheet.create({
  tabHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabUnderline: {
    width: 100, // 밑줄 길이 조절
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.textPrimary,
  },
  tabText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  // 모달
  modalBackground: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '85%',
  },
  fullScreenImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTextContainer: {
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: Typography.screenTitle,
    marginBottom: 5,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
  },
  modalKcalText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },
});
