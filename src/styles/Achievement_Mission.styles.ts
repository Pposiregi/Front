import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F4F4F4',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },

  listItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
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
});
