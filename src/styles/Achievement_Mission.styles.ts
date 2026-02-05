import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    marginVertical: 4,
    borderColor: '#333',
    borderWidth: 2,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
  },
  listItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50', // STEP이면 초록, MEAL이면 주황
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
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
