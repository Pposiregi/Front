import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts, Typography } from './theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_HORIZONTAL_PADDING = 24;
const CALENDAR_HORIZONTAL_PADDING = 8;
const CALENDAR_OUTER_GUTTER_RATIO = 0.02;
const CALENDAR_OUTER_GUTTER = Math.max(
  4,
  Math.round(SCREEN_WIDTH * CALENDAR_OUTER_GUTTER_RATIO)
);
const CALENDAR_CONTAINER_EXPAND = Math.max(
  0,
  CONTENT_HORIZONTAL_PADDING - CALENDAR_OUTER_GUTTER
);
const CALENDAR_AVAILABLE_WIDTH =
  SCREEN_WIDTH - CALENDAR_OUTER_GUTTER * 2 - CALENDAR_HORIZONTAL_PADDING * 2;
const DAY_CELL_GAP_RATIO = 0.045;
const GRID_SIZE = Math.min(
  52,
  Math.floor(CALENDAR_AVAILABLE_WIDTH / (7 + DAY_CELL_GAP_RATIO * 14))
); // 요일 7개 기준, gap 비율을 유지해 폭 맞추기
const DAY_CELL_GAP = Math.max(1, Math.round(GRID_SIZE * DAY_CELL_GAP_RATIO));
const GRID_RADIUS = Math.round(GRID_SIZE * 0.28);
const GRID_PADDING_V = Math.max(6, Math.round(GRID_SIZE * 0.2));
const GRID_PADDING_H = Math.max(4, Math.round(GRID_SIZE * 0.15));
const GRID_GAP = Math.max(8, Math.round(GRID_SIZE * 0.24));
const MODAL_CARD_SIZE = Math.round(
  Math.min(120, Math.max(90, SCREEN_WIDTH * 0.26))
);
const MODAL_CARD_RADIUS = Math.round(MODAL_CARD_SIZE * 0.22);
const MODAL_BUTTON_SIZE = Math.round(
  Math.min(36, Math.max(28, SCREEN_WIDTH * 0.08))
);
const MODAL_ROW_IMAGE = Math.round(
  Math.min(56, Math.max(44, SCREEN_WIDTH * 0.12))
);
const MODAL_ROW_RADIUS = Math.round(MODAL_BUTTON_SIZE * 0.7);
const MODAL_MAX_HEIGHT = Math.round(SCREEN_HEIGHT * 0.88);
const MODAL_MEAL_LIST_MAX_HEIGHT = Math.max(
  150,
  Math.min(280, Math.round(SCREEN_HEIGHT * 0.33))
);

const baseShadow = {
  shadowColor: Colors.shadow,
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 12,
  elevation: 4,
};

const STACK_HEIGHT = Math.round(GRID_SIZE * 0.7);
const STACK_ITEM_SIZE = Math.round(GRID_SIZE * 0.55);
const STACK_ITEM_OFFSET = (STACK_HEIGHT - STACK_ITEM_SIZE) / 2;
const STACK_ITEM_RADIUS = Math.round(STACK_ITEM_SIZE * 0.3);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h1,
    color: Colors.textPrimary,
  },
  headerSpacing: {
    marginBottom: 24,
  },
  calendarContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: CALENDAR_HORIZONTAL_PADDING,
    marginHorizontal: -CALENDAR_CONTAINER_EXPAND,
    ...baseShadow,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarMonthLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  calendarLoadingIndicator: {
    marginLeft: 8,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: GRID_GAP,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: Math.max(Typography.caption, Math.round(GRID_SIZE * 0.25)),
    color: Colors.textMuted,
    fontFamily: Fonts.JUA,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: GRID_GAP,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dayEmptySlot: {
    width: GRID_SIZE,
    height: GRID_SIZE,
  },
  dayInner: {
    width: GRID_SIZE,
    borderRadius: GRID_RADIUS,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: GRID_PADDING_V,
    paddingHorizontal: GRID_PADDING_H,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.surface,
    marginHorizontal: DAY_CELL_GAP,
    marginVertical: DAY_CELL_GAP,
  },
  dayNumber: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(Typography.caption, Math.round(GRID_SIZE * 0.3)),
    color: Colors.textPrimary,
  },
  dayNumberMuted: {
    color: Colors.textMuted,
  },
  selectedDayBackground: {
    borderColor: Colors.info,
    borderWidth: 2,
    backgroundColor: Colors.infoSoft,
  },
  todayDayOutline: {
    borderColor: Colors.accentStrong,
    borderWidth: 2,
    backgroundColor: Colors.accentSoft,
  },
  selectedDayNumber: {
    color: Colors.info,
  },
  todayDayNumber: {
    color: Colors.accentStrong,
  },
  dayPreviewPlaceholder: {
    width: STACK_ITEM_SIZE,
    height: STACK_ITEM_SIZE,
    borderRadius: STACK_ITEM_RADIUS,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dayPreviewPlaceholderText: {
    fontSize: Typography.bodySmall,
    color: Colors.divider,
  },
  sectionSpacing: {
    marginBottom: 24,
  },
  calendarHelperText: {
    marginTop: 24,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: Typography.bodySmall,
  },
  calendarErrorText: {
    marginTop: 16,
    textAlign: 'center',
    color: Colors.error,
    fontSize: Typography.bodySmall,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContentWrapper: {
    width: '88%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 26,
    paddingHorizontal: 24,
    maxHeight: MODAL_MAX_HEIGHT,
    ...baseShadow,
  },
  modalHeaderSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h1,
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    marginTop: Math.max(4, Math.round(SCREEN_WIDTH * 0.012)),
    fontSize: Math.max(Typography.caption, Math.round(SCREEN_WIDTH * 0.034)),
    color: Colors.textMuted,
  },
  modalFutureNoticeBox: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft,
  },
  modalFutureNoticeIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentStrong,
    marginRight: 10,
  },
  modalFutureNoticeIcon: {
    fontFamily: Fonts.JUA,
    color: Colors.surface,
    fontSize: Typography.caption,
    lineHeight: 16,
  },
  modalFutureNoticeBody: {
    flex: 1,
  },
  modalFutureNoticeTitle: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.bodySmall,
    color: '#B55B00',
  },
  modalFutureNoticeText: {
    marginTop: 1,
    fontSize: Typography.caption,
    color: '#A15A00',
  },
  modalPhotoRowScroll: {
    marginBottom: Math.max(14, Math.round(SCREEN_WIDTH * 0.05)),
  },
  modalPhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(2, Math.round(SCREEN_WIDTH * 0.01)),
  },
  modalPhotoCard: {
    width: MODAL_CARD_SIZE,
    height: MODAL_CARD_SIZE,
    borderRadius: MODAL_CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: Colors.infoSoft,
    marginHorizontal: Math.max(6, Math.round(SCREEN_WIDTH * 0.018)),
    position: 'relative',
  },
  modalPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalMealList: {
    marginTop: 4,
    // 외부 컨테이너와 ScrollView 둘 다 maxHeight를 둬 iOS/Android에서
    // 스크롤 영역이 의도보다 늘어나는 케이스를 방지한다.
    maxHeight: MODAL_MEAL_LIST_MAX_HEIGHT,
    flexShrink: 1,
  },
  modalMealListScroll: {
    maxHeight: MODAL_MEAL_LIST_MAX_HEIGHT,
    flexGrow: 0,
  },
  modalMealListContent: {
    paddingBottom: 4,
  },
  modalMealLoadingContainer: {
    minHeight: Math.max(80, Math.round(SCREEN_WIDTH * 0.23)),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEmptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: Typography.bodySmall,
    marginTop: 6,
  },
  modalErrorText: {
    marginTop: 8,
    textAlign: 'center',
    color: Colors.error,
    fontSize: Typography.caption,
  },
  modalMealRowContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: MODAL_ROW_RADIUS,
    paddingVertical: Math.max(12, Math.round(SCREEN_WIDTH * 0.03)),
    paddingHorizontal: Math.max(14, Math.round(SCREEN_WIDTH * 0.036)),
    marginBottom: Math.max(10, Math.round(SCREEN_WIDTH * 0.025)),
    borderWidth: 1,
    borderColor: Colors.divider,
    ...baseShadow,
  },
  modalMealRowEditing: {
    borderColor: Colors.infoStrong,
    backgroundColor: Colors.infoSoft,
  },
  modalMealControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Math.max(8, Math.round(SCREEN_WIDTH * 0.02)),
  },
  modalMealRemoveButton: {
    width: MODAL_BUTTON_SIZE,
    height: MODAL_BUTTON_SIZE,
    borderRadius: Math.round(MODAL_BUTTON_SIZE / 2),
    borderWidth: 1,
    borderColor: '#D8DBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.max(8, Math.round(SCREEN_WIDTH * 0.02)),
  },
  modalMealRemoveButtonDisabled: {
    opacity: 0.5,
  },
  modalMealRemoveLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(Typography.body, Math.round(SCREEN_WIDTH * 0.042)),
    color: Colors.textMuted,
  },
  modalMealRemoveIcon: {
    width: Math.max(18, Math.round(SCREEN_WIDTH * 0.053)),
    height: Math.max(18, Math.round(SCREEN_WIDTH * 0.053)),
  },
  modalMealRowContent: {
    flex: 1,
  },
  modalMealRowName: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(Typography.bodySmall, Math.round(SCREEN_WIDTH * 0.036)),
    color: '#2E313D',
  },
  modalMealRowCalories: {
    marginTop: 4,
    fontSize: Math.max(11, Math.round(SCREEN_WIDTH * 0.028)),
    color: '#9398B3',
  },
  modalMealRowImage: {
    width: MODAL_ROW_IMAGE,
    height: MODAL_ROW_IMAGE,
    borderRadius: Math.round(MODAL_ROW_IMAGE * 0.35),
    marginRight: Math.max(8, Math.round(SCREEN_WIDTH * 0.02)),
  },
  modalMealEditButton: {
    width: MODAL_BUTTON_SIZE,
    height: MODAL_BUTTON_SIZE,
    borderRadius: Math.round(MODAL_BUTTON_SIZE / 2),
    borderWidth: 1,
    borderColor: '#D8DBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Math.max(6, Math.round(SCREEN_WIDTH * 0.015)),
    backgroundColor: Colors.surface,
  },
  modalMealEditIcon: {
    width: Math.max(22, Math.round(SCREEN_WIDTH * 0.063)),
    height: Math.max(22, Math.round(SCREEN_WIDTH * 0.063)),
  },
  modalMealEditLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(13, Math.round(SCREEN_WIDTH * 0.032)),
    color: '#4C5AC7',
  },
  modalMealDragHandle: {
    width: 22,
    alignItems: 'center',
  },
  modalMealDragLabel: {
    fontSize: Typography.bodyLarge,
    color: Colors.textMuted,
  },
  modalAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: Colors.infoSoft,
  },
  modalAddIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E3F1',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddIconLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.bodyLarge,
    color: Colors.accentStrong,
  },
  modalAddEditIcon: {
    width: 32,
    height: 32,
  },
  modalAddInput: {
    marginLeft: 12,
    fontSize: 13,
    color: '#2E313D',
    paddingVertical: 0,
  },
  modalAddInputName: {
    flex: 2,
  },
  modalAddInputCalorie: {
    flex: 1,
  },
  modalCameraButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E3F1',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  modalCameraButtonDisabled: {
    opacity: 0.5,
  },
  modalCameraIcon: {
    fontSize: Typography.bodyLarge,
    color: '#9DA3BB',
  },
  modalEditRow: {
    marginTop: 18,
    backgroundColor: '#F5F7FF',
  },
  modalEditActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalEditButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  modalEditCancel: {
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C8CCE0',
    backgroundColor: Colors.surface,
  },
  modalEditSubmit: {
    marginLeft: 8,
    backgroundColor: Colors.accentStrong,
  },
  modalEditActionDisabled: {
    opacity: 0.5,
  },
  modalEditCancelLabel: {
    fontFamily: Fonts.JUA,
    color: '#8F95AF',
    fontSize: Typography.bodySmall,
  },
  modalEditSubmitLabel: {
    fontFamily: Fonts.JUA,
    color: Colors.surface,
    fontSize: Typography.bodySmall,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  modalTotalLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.body,
    color: '#4A4E66',
  },
  modalTotalValue: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.body,
    color: Colors.accentStrong,
    marginLeft: 6,
  },
  modalPrimaryButton: {
    marginTop: 20,
    backgroundColor: Colors.accentStrong,
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    ...baseShadow,
  },
  modalPrimaryButtonDisabled: {
    opacity: 0.6,
  },
  modalPrimaryButtonLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.body,
    color: Colors.surface,
  },
  modalSecondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalSecondaryButtonLabel: {
    fontSize: Typography.bodySmall,
    color: '#8F94AB',
  },
  stackThumb: {
    width: '100%',
    height: STACK_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 셀 프레임 바깥으로 이미지가 넘치지 않도록 제한
  },
  stackImage: {
    position: 'absolute',
    width: STACK_ITEM_SIZE,
    height: STACK_ITEM_SIZE,
    borderRadius: STACK_ITEM_RADIUS,
    borderWidth: 2, // 겹침 경계 또렷하게
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    top: STACK_ITEM_OFFSET,
  },
});
