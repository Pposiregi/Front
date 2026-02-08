import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    marginVertical: 4,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  // Mission Item
  listItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50', // STEP이면 초록, MEAL이면 주황으로 런타임에 바꿔서 적용 가능
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    fontSize: 18,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  listItemSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  rightBox: {
    alignItems: 'flex-end',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  timeText: {
    marginTop: 2,
    fontSize: 12,
    color: '#999',
  },

  // List Header
  listHeaderContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-VariableFont',
    color: '#333',
  },
  listHeaderSubtitle: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Roboto-VariableFont',
    color: '#333',
  },

  // 기간 선택 버튼
  dateRangeButton: {
    padding: 8,
  },
  dateRangeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  // 모달
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtonText: {
    fontSize: 14,
    color: '#333',
  },
});
