import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /**
   * 뱃지
   */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
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
    width: 70,
    height: 70,
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
});
