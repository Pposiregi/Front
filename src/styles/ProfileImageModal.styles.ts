import { StyleSheet } from 'react-native';
import { Colors, Fonts, Typography } from './theme';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: Typography.h2,
    fontFamily: Fonts.JUA,
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.infoStrong,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    padding: 10,
  },
  cancelText: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h2,
    color: Colors.textPrimary,
  },
  saveBtn: {
    padding: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  saveText: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h2,
    color: Colors.surface,
  },
});
