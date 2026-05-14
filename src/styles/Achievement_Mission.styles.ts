import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows, Typography } from './theme';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 4,
  },
  sectionHeaderText: {
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  listItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: Colors.success, // STEP이면 초록, MEAL이면 주황으로 런타임에 바꿔서 적용 가능
    ...Shadows.surfaceRaised,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: Typography.bodyLarge,
  },
  listItemTitle: {
    fontSize: Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  listItemSub: {
    marginTop: 4,
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rightBox: {
    alignItems: 'flex-end',
  },
  completedText: {
    fontSize: Typography.bodySmall,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    color: Colors.success,
  },
  timeText: {
    marginTop: 2,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  listHeaderContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeaderTitle: {
    fontSize: Typography.bodyLarge,
    fontFamily: Fonts.Pretendard,
    color: Colors.textPrimary,
  },
  listHeaderSubtitle: {
    fontSize: Typography.bodySmall,
    marginTop: 4,
    fontFamily: Fonts.Pretendard,
    color: Colors.textPrimary,
  },
  dateRangeButton: {
    padding: 8,
  },
  dateRangeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.overlayDark,
  },
  modalContent: {
    margin: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: Typography.body,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.disabled,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtonText: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
});
