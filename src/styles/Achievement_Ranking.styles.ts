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
  rankAvatarContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankingNumberImage: { width: 50, height: 50, resizeMode: 'contain' },
  rankingNumberText: {
    fontSize: 22, // 가독성을 위해 살짝 조절
    fontFamily: 'JUA',
    textAlign: 'center',
    color: '#333',
  },
  rankingNameScoreContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
  },
  listItemBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingRight: 16,
    paddingLeft: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    minHeight: 70,
  },
  listItemText: {
    fontSize: 16,
    fontFamily: 'Roboto-VariableFont',
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
    fontFamily: 'Roboto-VariableFont',
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
