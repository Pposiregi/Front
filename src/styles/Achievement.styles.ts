import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    fontSize: 20,
    color: '#888',
  },
  activeTabText: {
    color: '#333',
    marginBottom: 3,
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
});
