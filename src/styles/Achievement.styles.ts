import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 모달
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'JUA',
  },
  modalKcalText: {
    fontSize: 18,
    color: '#555',
    fontFamily: 'GowunDodum',
  },
  /**
   * 뱃지
   */
  badgeCard: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    elevation: 3,
    marginHorizontal: 20,
  },
  badgeTitle: {
    fontSize: 24,
    fontFamily: 'JUA',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeItem: {
    marginRight: -3,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  tabHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontWeight: 'bold',
  },
  /**
   * 랭킹
   */
  rankingNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  rankingNameScoreContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  rankingFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#EEE', // 기본 배경색
    alignItems: 'center',
  },
  rankingFilterButtonText: {
    fontSize: 14,
    color: '#000', // 기본 글자색
    fontWeight: 'bold',
  },
  rankingFilterButtonActive: {
    backgroundColor: '#007AFF', // 활성화 배경색
  },
  rankingFilterButtonTextActive: {
    color: '#FFF', // 활성화 글자색
  },
  /**
   * 미션
   */
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: '#f6f6f6',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  listItemTitle: {
    fontSize: 15,
    color: '#222',
  },
});
