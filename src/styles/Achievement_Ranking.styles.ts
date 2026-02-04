import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /**
   * 랭킹
   */
  rankingNumberText: {
    fontSize: 18, // 가독성을 위해 살짝 조절
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
    fontSize: 18,
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
    fontSize: 16,
    fontFamily: 'JUA',
    textAlign: 'center',
    color: '#fff', // 흰색 글자
  },
});
