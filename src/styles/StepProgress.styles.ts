import { StyleSheet, Dimensions } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

const CARD_WIDTH = Math.max(
  150,
  Math.min(220, Math.round(SCREEN_WIDTH * 0.42))
);
const CARD_HEIGHT = Math.max(
  80,
  Math.min(110, Math.round(SCREEN_HEIGHT * 0.08))
);

export default StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'JUA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  completeHint: {
    fontSize: 13,
    fontFamily: 'JUA',
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'JUA',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
  readyCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#F4FFF6',
    shadowOpacity: 0.15,
    elevation: 6,
  },
});
