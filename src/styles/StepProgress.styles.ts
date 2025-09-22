import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 10,
  },
  title: {
    fontFamily: 'JUA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'JUA',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});
