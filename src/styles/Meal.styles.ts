import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import {
  bottomContentPadding,
  cardRadius,
  Colors,
  Fonts,
  layoutScale,
  Radius,
  screenPadding,
  Shadows,
  Spacing,
  Typography,
} from './theme';

const CONTENT_HORIZONTAL_PADDING = screenPadding;
const CALENDAR_HORIZONTAL_PADDING = layoutScale(10, Spacing.sm, Spacing.md);
const CALENDAR_OUTER_GUTTER_RATIO = 0.02;
const CALENDAR_OUTER_GUTTER = layoutScale(6, 4, 8);
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
const CONTENT_TOP_PADDING = layoutScale(14, Spacing.md, Spacing.lg);
const CONTENT_BOTTOM_PADDING = bottomContentPadding;
const HEADER_BUTTON_SIZE = layoutScale(38, 36, 42);
const HEADER_BUTTON_RADIUS = Math.round(HEADER_BUTTON_SIZE / 2);
const HEADER_SECTION_SPACING = layoutScale(24, Spacing.xxl, 28);
const CALENDAR_RADIUS = cardRadius;
const CALENDAR_VERTICAL_PADDING = layoutScale(14, Spacing.md, Spacing.lg);
const MONTH_ROW_MARGIN_BOTTOM = layoutScale(14, Spacing.md, Spacing.lg);
const MODAL_CARD_SIZE = layoutScale(104, 90, 120);
const MODAL_CARD_RADIUS = Math.round(MODAL_CARD_SIZE * 0.22);
const MODAL_BUTTON_SIZE = layoutScale(32, 28, 36);
const MODAL_ROW_IMAGE = layoutScale(48, 44, 56);
const MODAL_ROW_RADIUS = Math.round(MODAL_BUTTON_SIZE * 0.7);
const MODAL_MAX_HEIGHT = Math.round(SCREEN_HEIGHT * 0.88);
const MODAL_MEAL_LIST_MAX_HEIGHT = Math.max(
  150,
  Math.min(280, Math.round(SCREEN_HEIGHT * 0.33))
);

const MODAL_CONTENT_RADIUS = cardRadius + layoutScale(8, 6, 10);
const MODAL_CONTENT_VERTICAL_PADDING = layoutScale(28, 26, 34);
const MODAL_CONTENT_HORIZONTAL_PADDING = screenPadding;
const MODAL_HEADER_MARGIN_BOTTOM = layoutScale(20, 18, 24);
const MODAL_NOTICE_RADIUS = Radius.lg;
const MODAL_NOTICE_ICON_SIZE = layoutScale(24, 24, 28);
const MODAL_NOTICE_ICON_RADIUS = Math.round(MODAL_NOTICE_ICON_SIZE / 2);
const MODAL_LIST_TOP_MARGIN = layoutScale(4, Spacing.xs, Spacing.sm);
const STACK_IMAGE_BORDER = Colors.surface;
const baseShadow = Shadows.surfaceRaised;

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
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
    borderRadius: HEADER_BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    textShadowColor: Colors.shadowSoft,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSpacing: {
    marginBottom: HEADER_SECTION_SPACING,
  },
  calendarContainer: {
    backgroundColor: Colors.surface,
    borderRadius: CALENDAR_RADIUS,
    paddingVertical: CALENDAR_VERTICAL_PADDING,
    paddingHorizontal: CALENDAR_HORIZONTAL_PADDING,
    marginHorizontal: -CALENDAR_CONTAINER_EXPAND,
    ...baseShadow,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MONTH_ROW_MARGIN_BOTTOM,
  },
  calendarMonthLabel: {
    fontFamily: Fonts.Pretendard,
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
    fontFamily: Fonts.Pretendard,
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
    fontFamily: Fonts.Pretendard,
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
    marginBottom: HEADER_SECTION_SPACING,
  },
  calendarHelperText: {
    marginTop: HEADER_SECTION_SPACING,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: Typography.bodySmall,
  },
  calendarErrorText: {
    marginTop: layoutScale(18, Spacing.lg, Spacing.xl),
    textAlign: 'center',
    color: Colors.error,
    fontSize: Typography.bodySmall,
  },
  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.overlaySoft,
  },
  modalContentWrapper: {
    width: '88%',
  },
  mealModalKeyboardContent: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: layoutScale(18, 16, 22),
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: MODAL_CONTENT_RADIUS,
    paddingVertical: MODAL_CONTENT_VERTICAL_PADDING,
    paddingHorizontal: MODAL_CONTENT_HORIZONTAL_PADDING,
    maxHeight: MODAL_MAX_HEIGHT,
    ...baseShadow,
  },
  modalHeaderSection: {
    alignItems: 'center',
    marginBottom: MODAL_HEADER_MARGIN_BOTTOM,
  },
  modalTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    marginTop: layoutScale(4, 4, 6),
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  modalFutureNoticeBox: {
    marginTop: Spacing.sm,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layoutScale(10, 10, 12),
    paddingHorizontal: screenPadding,
    borderRadius: MODAL_NOTICE_RADIUS,
    borderWidth: 1,
    borderColor: Colors.accentStrong,
    backgroundColor: Colors.accentSoft,
  },
  modalFutureNoticeIconWrap: {
    width: MODAL_NOTICE_ICON_SIZE,
    height: MODAL_NOTICE_ICON_SIZE,
    borderRadius: MODAL_NOTICE_ICON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentStrong,
    marginRight: layoutScale(10, Spacing.md - 2, Spacing.lg),
  },
  modalFutureNoticeIcon: {
    fontFamily: Fonts.Pretendard,
    color: Colors.surface,
    fontSize: Typography.caption,
    lineHeight: 16,
  },
  modalFutureNoticeBody: {
    flex: 1,
  },
  modalFutureNoticeTitle: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    fontSize: Typography.bodySmall,
    color: Colors.accentStrong,
  },
  modalFutureNoticeText: {
    marginTop: 1,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  modalPhotoRowScroll: {
    marginBottom: layoutScale(18, 14, 22),
  },
  modalPhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layoutScale(4, 2, 6),
  },
  modalPhotoCard: {
    width: MODAL_CARD_SIZE,
    height: MODAL_CARD_SIZE,
    borderRadius: MODAL_CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: Colors.infoSoft,
    marginHorizontal: layoutScale(7, 6, 9),
    position: 'relative',
  },
  modalPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalMealList: {
    marginTop: MODAL_LIST_TOP_MARGIN,
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
    minHeight: layoutScale(88, 80, 96),
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
    paddingVertical: layoutScale(12, 12, 14),
    paddingHorizontal: screenPadding,
    marginBottom: layoutScale(10, 10, 12),
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
    marginRight: layoutScale(8, 8, 10),
  },
  modalMealRemoveButton: {
    width: MODAL_BUTTON_SIZE,
    height: MODAL_BUTTON_SIZE,
    borderRadius: Math.round(MODAL_BUTTON_SIZE / 2),
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layoutScale(8, 8, 10),
  },
  modalMealRemoveButtonDisabled: {
    opacity: 0.5,
  },
  modalMealRemoveLabel: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    fontSize: Typography.body,
    color: Colors.textMuted,
  },
  modalMealRemoveIcon: {
    width: layoutScale(20, 18, 22),
    height: layoutScale(20, 18, 22),
  },
  modalMealRowContent: {
    flex: 1,
  },
  modalMealRowName: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  modalMealRowCalories: {
    marginTop: 4,
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  modalMealRowImage: {
    width: MODAL_ROW_IMAGE,
    height: MODAL_ROW_IMAGE,
    borderRadius: Math.round(MODAL_ROW_IMAGE * 0.35),
    marginRight: layoutScale(8, 8, 10),
  },
  modalMealEditButton: {
    width: MODAL_BUTTON_SIZE,
    height: MODAL_BUTTON_SIZE,
    borderRadius: Math.round(MODAL_BUTTON_SIZE / 2),
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: layoutScale(6, 6, 8),
    backgroundColor: Colors.surface,
  },
  modalMealEditIcon: {
    width: layoutScale(24, 22, 26),
    height: layoutScale(24, 22, 26),
  },
  modalMealEditLabel: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    fontSize: Typography.caption,
    color: Colors.infoStrong,
  },
  modalMealDragHandle: {
    width: 22,
    alignItems: 'center',
  },
  modalMealDragLabel: {
    fontSize: Typography.bodyLarge,
    color: Colors.textMuted,
  },
  imagePreviewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenPadding,
    paddingVertical: Spacing.xxl,
  },
  imagePreviewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayDark,
  },
  imagePreview: {
    width: '100%',
    height: '82%',
  },
  imagePreviewCloseButton: {
    marginTop: Spacing.xl,
    paddingHorizontal: screenPadding,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  imagePreviewCloseText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: layoutScale(18, 16, 20),
    paddingHorizontal: screenPadding,
    paddingVertical: layoutScale(12, 12, 14),
    borderRadius: cardRadius,
    backgroundColor: Colors.infoSoft,
  },
  modalAddIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddIconLabel: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    fontSize: Typography.bodyLarge,
    color: Colors.accentStrong,
  },
  modalAddEditIcon: {
    width: 32,
    height: 32,
  },
  modalAddInput: {
    marginLeft: 12,
    fontSize: Typography.caption,
    color: Colors.textPrimary,
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
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.divider,
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
    color: Colors.textMuted,
  },
  modalEditRow: {
    marginTop: layoutScale(18, 16, 20),
    backgroundColor: Colors.infoSoft,
  },
  modalEditActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalEditButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: layoutScale(12, 12, 14),
    borderRadius: Radius.lg,
  },
  modalEditCancel: {
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
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
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    color: Colors.textMuted,
    fontSize: Typography.bodySmall,
  },
  modalEditSubmitLabel: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    color: Colors.surface,
    fontSize: Typography.bodySmall,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  modalTotalLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  modalTotalValue: {
    fontFamily: Fonts.Pretendard,
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
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    fontSize: Typography.body,
    color: Colors.surface,
  },
  modalSecondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalSecondaryButtonLabel: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
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
    borderColor: STACK_IMAGE_BORDER,
    top: STACK_ITEM_OFFSET,
  },
});
