import { StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Typography } from './theme';
import { SCREEN_HEIGHT } from './dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pagerView: { flex: 1 },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: Fonts.JUA,
    color: Colors.textPrimary,
    fontSize: Typography.bodyLarge,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
    marginBottom: Spacing.xs,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.disabled,
    marginHorizontal: Spacing.xs,
  },
  activeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6347',
  },
});
