import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 20,
  },
  podiumBlock: {
    width: 80,
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  first: {
    height: 120,
    backgroundColor: '#FFD700', // 금색
  },
  second: {
    height: 100,
    backgroundColor: '#C0C0C0', // 은색
  },
  third: {
    height: 100,
    backgroundColor: '#CD7F32', // 동색
  },
  podiumRank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  podiumName: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  podiumScore: {
    fontSize: 14,
    color: '#555',
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
    fontFamily: 'Roboto-VariableFont',
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
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabUnderline: {
    width: 100, // 밑줄 길이 조절
    height: 2,
    borderRadius: 1,
    backgroundColor: '#333', // 밑줄 색
  },
  tabText: {
    fontFamily: 'JUA',
    fontSize: 24,
    color: '#888',
  },
  activeTabText: {
    color: '#333',
    marginBottom: 3,
  },
  /**
   * 랭킹
   */
  rankingNumberText: {
    fontSize: 22, // 가독성을 위해 살짝 조절
    fontFamily: 'JUA',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
    color: '#333',
  },
  rankingNameScoreContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  listItemText: {
    fontSize: 22,
    fontFamily: 'JUA',
    color: '#444',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
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
  noRankingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noRankingText: {
    fontSize: 25,
    color: '#333',
    fontFamily: 'JUA',
  },
  myRankingHighlight: {
    backgroundColor: '#FFF3E0',
  },
  myRankingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  myRankingText: {
    fontSize: 22,
    fontFamily: 'JUA',
    textAlign: 'center',
    color: '#fff', // 흰색 글자
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
  listItemSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  checkIcon: {
    fontSize: 18,
    color: '#4CAF50',
    marginLeft: 12,
  },
});
