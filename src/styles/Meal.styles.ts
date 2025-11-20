import { StyleSheet } from 'react-native';

const baseShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 12,
  elevation: 4,
};

const STACK_HEIGHT = 32; // 썸네일 영역 높이 TODO: 상대값으로 바꿔야하는가
const STACK_ITEM_SIZE = 24; // 각 이미지 및 플레이스홀더 크기 TODO: 상대값으로 바꿔야하는가
const STACK_ITEM_OFFSET = (STACK_HEIGHT - STACK_ITEM_SIZE) / 2;
const STACK_ITEM_RADIUS = 8; // 이미지 모서리 반경

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F8',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
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
    fontFamily: 'JUA',
    fontSize: 20,
    color: '#14151A',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontFamily: 'JUA',
    fontSize: 27,
    color: '#2B2B2B',
  },
  headerSpacing: {
    marginBottom: 24,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 16,
    ...baseShadow,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarMonthLabel: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: '#2B2B2B',
  },
  calendarLoadingIndicator: {
    marginLeft: 8,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#9597A3',
    fontFamily: 'JUA',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dayEmptySlot: {
    width: 48,
    height: 48,
  },
  dayInner: {
    width: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E4E6F1',
    backgroundColor: '#FFFFFF',
  },
  dayNumber: {
    fontFamily: 'JUA',
    fontSize: 15,
    color: '#383A45',
  },
  dayNumberMuted: {
    color: '#C8CAD4',
  },
  selectedDayBackground: {
    borderColor: '#1D7ED8',
    borderWidth: 2,
    backgroundColor: '#EAF3FF',
  },
  todayDayOutline: {
    borderColor: '#FF9F43',
    borderWidth: 2,
    backgroundColor: '#FFF7EB',
  },
  selectedDayNumber: {
    color: '#1D7ED8',
  },
  todayDayNumber: {
    color: '#FF9F43',
  },
  dayPreviewThumbnail: {
    width: 28,
    height: 28,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E6F1',
    backgroundColor: '#F4F6FB',
  },
  dayPreviewPlaceholder: {
    width: STACK_ITEM_SIZE,
    height: STACK_ITEM_SIZE,
    borderRadius: STACK_ITEM_RADIUS,
    borderWidth: 1,
    borderColor: '#E4E6F1',
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dayPreviewPlaceholderText: {
    fontSize: 14,
    color: '#C2C7D8',
  },
  catContainer: {
    alignItems: 'center',
  },
  catImage: {
    width: 240,
    height: 180,
    resizeMode: 'contain',
  },
  detailContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    ...baseShadow,
  },
  sectionSpacing: {
    marginBottom: 24,
  },
  detailHeader: {},
  detailDate: {
    fontFamily: 'JUA',
    fontSize: 20,
    color: '#292C36',
  },
  detailSubtitle: {
    fontSize: 13,
    color: '#9CA0AE',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFD970',
  },
  badgeSpacing: {
    marginRight: 8,
  },
  badgeLabel: {
    fontFamily: 'JUA',
    color: '#714A00',
    fontSize: 13,
  },
  mealsSection: {
    marginTop: 12,
  },
  mealRowSpacing: {
    marginTop: 12,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#F5F6FB',
  },
  mealImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFE1A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  mealPlaceholderText: {
    fontFamily: 'JUA',
    color: '#C97E09',
    fontSize: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealInfoSpacing: {
    marginBottom: 4,
  },
  mealName: {
    fontFamily: 'JUA',
    fontSize: 15,
    color: '#2E313D',
  },
  mealCalories: {
    fontSize: 12,
    color: '#888DA0',
  },
  mealActions: {
    alignItems: 'flex-end',
  },
  mealActionSpacing: {
    marginBottom: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E2EC',
  },
  iconButtonLabel: {
    fontFamily: 'JUA',
    fontSize: 14,
    color: '#7781A9',
  },
  emptyState: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#F6F7FC',
    alignItems: 'center',
  },
  emptyStateSpacing: {
    marginBottom: 6,
  },
  emptyStateTitle: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#5F6485',
  },
  emptyStateText: {
    fontSize: 12,
    color: '#949AB6',
    textAlign: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#EFF1F9',
    paddingHorizontal: 14,
  },
  addRowSpacing: {
    marginTop: 20,
  },
  addRowLabelPrimary: {
    flex: 1,
    color: '#9AA0BB',
    fontSize: 13,
  },
  addRowLabelSecondary: {
    color: '#C1C5DA',
    fontSize: 13,
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#4A4E66',
  },
  summaryValue: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#FF9157',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#FF9F43',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#FFFFFF',
  },
  calendarHelperText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#7C8098',
    fontSize: 14,
  },
  calendarErrorText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#D9534F',
    fontSize: 13,
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
    ...baseShadow,
  },
  modalHeaderSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontFamily: 'JUA',
    fontSize: 22,
    color: '#222430',
  },
  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9DA2B5',
  },
  modalPhotoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 22,
  },
  modalPhotoCard: {
    width: 108,
    height: 108,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F4F6FB',
    marginHorizontal: 8,
    position: 'relative',
  },
  modalPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalMealList: {
    marginTop: 4,
  },
  modalMealLoadingContainer: {
    minHeight: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEmptyText: {
    textAlign: 'center',
    color: '#9DA2B5',
    fontSize: 13,
    marginTop: 8,
  },
  modalErrorText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#D9534F',
    fontSize: 12,
  },
  modalMealRowContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E6F1',
    ...baseShadow,
  },
  modalMealRowEditing: {
    borderColor: '#5F6BEA',
    backgroundColor: '#EDF1FF',
  },
  modalMealControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  modalMealRemoveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalMealRemoveButtonDisabled: {
    opacity: 0.5,
  },
  modalMealRemoveLabel: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: '#8F95AF',
  },
  modalMealRowContent: {
    flex: 1,
  },
  modalMealRowName: {
    fontFamily: 'JUA',
    fontSize: 15,
    color: '#2E313D',
  },
  modalMealRowCalories: {
    marginTop: 4,
    fontSize: 12,
    color: '#9398B3',
  },
  modalMealRowImage: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 12,
  },
  modalMealEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
  },
  modalMealEditLabel: {
    fontFamily: 'JUA',
    fontSize: 15,
    color: '#4C5AC7',
  },
  modalMealDragHandle: {
    width: 22,
    alignItems: 'center',
  },
  modalMealDragLabel: {
    fontSize: 18,
    color: '#B6BBCE',
  },
  modalAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#F6F7FC',
  },
  modalAddIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E3F1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddIconLabel: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: '#FF9F43',
  },
  modalAddInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#2E313D',
    paddingVertical: 0,
  },
  modalAddInputCalorie: {
    flex: 0,
    width: 90,
  },
  modalCameraButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E3F1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  modalCameraIcon: {
    fontSize: 18,
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
    backgroundColor: '#FFFFFF',
  },
  modalEditSubmit: {
    marginLeft: 8,
    backgroundColor: '#FF9F43',
  },
  modalEditActionDisabled: {
    opacity: 0.5,
  },
  modalEditCancelLabel: {
    fontFamily: 'JUA',
    color: '#8F95AF',
    fontSize: 14,
  },
  modalEditSubmitLabel: {
    fontFamily: 'JUA',
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  modalTotalLabel: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#4A4E66',
  },
  modalTotalValue: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#FF9157',
    marginLeft: 6,
  },
  modalPrimaryButton: {
    marginTop: 20,
    backgroundColor: '#FF9F43',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    ...baseShadow,
  },
  modalPrimaryButtonLabel: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalSecondaryButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalSecondaryButtonLabel: {
    fontSize: 14,
    color: '#8F94AB',
  },
  stackThumb: {
    width: '100%',
    height: STACK_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // 겹쳐진 이미지가 밖으로 나가도 보이게
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
