import { Dimensions, StyleSheet } from 'react-native';

export const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 오늘의 러닝
  map: {
    height: height * 0.4,
    width: width * 0.8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardColunm: {
    flexDirection: 'column',
    marginTop: 20,
  },
  runningCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    elevation: 3,
    marginHorizontal: 20,
  },
  runningTitle: {
    fontSize: 26,
    fontFamily: 'JUA',
    textAlign: 'center',
    marginTop: 20,
  },
  statBox: {
    padding: 12,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'GowunDodum',
  },
  // 오늘의 식단 & 오늘의 걸음
  mealRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    gap: 10,
  },
  mealCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  mealTitle: {
    fontSize: 24,
    fontFamily: 'JUA',
    textAlign: 'center',
  },
  mealColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealGridItem: {
    flex: 1,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mealImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  mealKcal: {
    fontSize: 14,
    color: '#666',
  },
  mealKcalValueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'JUA',
    alignSelf: 'center',
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
  // 이번주 걸음
  weeklyStatBox: {
    marginTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  weeklyStatText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
    fontFamily: 'GowunDodum',
  },
  weeklyValueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'JUA',
  },
  weeklySubText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  chartMaskContainer: {
    overflow: 'hidden', // 벗어난 영역 삭제
  },
  lineChartShiftStyle: {
    // 차트 자체를 음수로 이동시켜 Y축 라벨 공간을 메움
    marginLeft: -width * 0.09, // 차트 왼쪽 강제 이동
    marginBottom: -20, // X축 라벨 공간도 삭제
  },
  // 뱃지
  badgeCard: {
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
});
