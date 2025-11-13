import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
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
