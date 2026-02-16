import { StyleSheet } from 'react-native';

/**
 * 미션 UI
 */
export default StyleSheet.create({
  missionView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '95%',
    height: '83%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  missionTitle: {
    fontSize: 28,
    marginBottom: 12,
    fontFamily: 'JUA',
    color: '#333333',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FEC288',
  },
  tabText: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#333333',
  },
  tabTextActive: {
    color: '#fff',
  },
  emptyMissionText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
  missionUICard: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  missionUICardReadbyBorder: {
    backgroundColor: '#ffefe0',
    borderWidth: 2,
    borderColor: '#FEC288',
    borderRadius: 12,
  },
  missionUICardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  missionUITextTitle: {
    fontSize: 20,
    fontFamily: 'JUA',
    color: '#333333',
  },
  flexEndContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  completeButton: {
    paddingVertical: 8,
    minWidth: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto',
  },
  completeButtonTextDisabled: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Roboto',
  },
  missionUIText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FEC288',
  },
  missionUIExitButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#FEC288',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionUIExitText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'JUA',
  },
  summaryBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 24,
    marginBottom: 12,
    fontFamily: 'JUA',
    color: '#333333',
    textAlign: 'center',
  },
  summaryList: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'JUA',
  },
  summaryValue: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'JUA',
  },
  summaryValueGroup: {
    alignItems: 'flex-end',
  },
  summarySubValue: {
    marginTop: 2,
    fontSize: 12,
    color: '#888888',
    fontFamily: 'Roboto',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  summaryCaption: {
    marginTop: 4,
    fontSize: 12,
    color: '#999999',
    fontFamily: 'JUA',
    textAlign: 'right',
  },
});
