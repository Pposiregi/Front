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
    fontFamily: Fonts.JUA,
    fontSize: Typography.h2,
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  // 모달
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
    fontSize: Typography.h1,
    marginBottom: 5,
    fontFamily: Fonts.JUA,
  },
  modalKcalText: {
    fontSize: Typography.bodyLarge,
    color: '#555',
    fontFamily: Fonts.Roboto_VariableFont,
  },
});
