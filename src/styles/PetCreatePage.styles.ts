import { StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Typography, Radius } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    backgroundColor: Colors.background,
  },
  introBox: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.screenTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Fonts.JUA,
  },
  subtitle: {
    fontSize: Typography.body,
    marginTop: Spacing.xl,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
    lineHeight: 23,
  },
  petContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 30,
  },
  petImage: {
    width: 80,
    height: 80,
    marginBottom: Spacing.sm,
    resizeMode: 'contain',
  },
  selectedPetImage: {
    width: 200,
    height: 200,
    marginVertical: Spacing.xl,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  card: {
    width: 140,
    height: 140,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: Colors.accentStrong,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 50,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: Spacing.xl,
    color: Colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },
  button: {
    backgroundColor: Colors.accentStrong,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.surface,
    fontWeight: '700',
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
  },
});
