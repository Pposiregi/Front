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
});
