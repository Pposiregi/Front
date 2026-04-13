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
  galleryBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  galleryBtnText: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h2,
    color: Colors.textPrimary,
  },
  sectionLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  historyScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  confirmBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  confirmTitle: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  confirmPreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
    backgroundColor: Colors.divider,
  },
});
