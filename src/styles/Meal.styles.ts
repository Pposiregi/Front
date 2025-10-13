import { StyleSheet } from 'react-native';

const baseShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 12,
  elevation: 4,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F8',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
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
    color: '#2B2B2B',
  },
  headerTitle: {
    fontFamily: 'JUA',
    fontSize: 22,
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
  dayInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#383A45',
  },
  dayNumberMuted: {
    color: '#C8CAD4',
  },
  selectedDayBackground: {
    backgroundColor: '#1D7ED8',
  },
  selectedDayNumber: {
    color: '#FFFFFF',
  },
  mealIndicatorRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  mealIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFE5A9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD178',
  },
  mealIndicatorText: {
    fontFamily: 'JUA',
    fontSize: 12,
    color: '#C97E09',
  },
  mealIndicatorSpacing: {
    marginRight: 6,
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
});
