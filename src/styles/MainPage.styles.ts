-0;

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA64D',
    paddingTop: 20,
    paddingBottom: 60, // space for bottom nav
  },
  progressRow: {
    paddingHorizontal: 16,
  },
  message: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 18,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  startText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  navIcon: {
    fontSize: 24,
  },
});
