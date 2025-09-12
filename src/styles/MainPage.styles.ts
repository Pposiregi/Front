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
  missionCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  message: {
    fontFamily: 'JUA',
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
    fontFamily: 'JUA',
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
  removeText: {
    marginTop: 4,
    color: '#fff',
    fontSize: 12,
  },
});
