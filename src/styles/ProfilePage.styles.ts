import { Platform, StyleSheet, Dimensions } from 'react-native';
import { SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Typography } from './theme';

const { width: deviceWidth } = Dimensions.get('window');
const baseUnit = deviceWidth / 24; // 반응형 기준 단위
const avatarSize = Math.max(80, Math.round(deviceWidth * 0.24));
const gearSize = Math.max(28, Math.round(deviceWidth * 0.09));
const cardRadius = Math.max(12, Math.round(deviceWidth * 0.04));
const cardPadding = Math.max(12, Math.round(deviceWidth * 0.04));
const headerFont = Math.max(
  Typography.bodyLarge,
  Math.round(deviceWidth * 0.05)
);
const bodyFont = Math.max(Typography.caption, Math.round(deviceWidth * 0.034));
const smallFont = Math.max(
  Typography.caption - 1,
  Math.round(deviceWidth * 0.03)
);
const titleFont = Math.max(Typography.h2, Math.round(deviceWidth * 0.053));
const metricNumberFont = Math.max(
  Typography.body,
  Math.round(deviceWidth * 0.05)
);
const chartRadius = Math.max(10, Math.round(deviceWidth * 0.03));
const chartPadding = Math.max(10, Math.round(deviceWidth * 0.035));
const contentPadding = Math.max(16, Math.round(deviceWidth * 0.048));
const progressHeight = Math.max(6, Math.round(deviceWidth * 0.02));
const progressRadius = Math.round(progressHeight * 1.2);
const bottomPadding = Math.max(100, Math.round(deviceWidth * 0.28));

const cardShadow = {
  shadowColor: Colors.shadow,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 4,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: contentPadding,
    paddingTop: Platform.select({ ios: 6, android: 6 }),
    paddingBottom: bottomPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: Math.max(8, Math.round(baseUnit * 1.2)),
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: Math.round(avatarSize / 2),
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  avatarEmoji: {
    fontSize: Math.max(32, Math.round(avatarSize * 0.48)),
  },
  gearButton: {
    position: 'absolute',
    bottom: -Math.round(gearSize * 0.12),
    right: -Math.round(gearSize * 0.15),
    width: gearSize,
    height: gearSize,
    borderRadius: Math.round(gearSize / 2),
    backgroundColor: Colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  gearText: {
    fontSize: Math.max(14, Math.round(gearSize * 0.52)),
  },
  name: {
    marginTop: Math.max(8, Math.round(baseUnit * 1.2)),
    fontFamily: Fonts.JUA,
    fontSize: titleFont,
    color: '#1F2937',
  },
  caption: {
    marginTop: Math.max(4, Math.round(baseUnit * 0.8)),
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: bodyFont,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Math.max(10, Math.round(baseUnit * 1.4)),
    marginBottom: Math.max(6, Math.round(baseUnit * 1)),
  },
  sectionTitle: {
    fontFamily: Fonts.JUA,
    fontSize: headerFont,
    color: Colors.textPrimary,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Math.max(10, Math.round(baseUnit * 1.3)),
    paddingVertical: Math.max(4, Math.round(baseUnit * 0.7)),
    borderRadius: Math.max(10, Math.round(baseUnit * 1.4)),
  },
  recordIcon: {
    marginRight: Math.max(4, Math.round(baseUnit * 0.8)),
  },
  recordText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: bodyFont,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    paddingVertical: Math.max(10, Math.round(cardPadding * 0.8)),
    paddingHorizontal: cardPadding,
    marginBottom: Math.max(10, Math.round(baseUnit * 1.3)),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  metricCardSingle: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    paddingVertical: Math.max(10, Math.round(cardPadding * 0.8)),
    paddingHorizontal: cardPadding,
    marginBottom: Math.max(10, Math.round(baseUnit * 1.3)),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  metricLabel: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(10, Math.round(baseUnit * 1.1)),
    lineHeight: Math.max(12, Math.round(baseUnit * 1.4)),
    color: Colors.textPrimary,
  },
  metricAim: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: smallFont,
    color: Colors.textSecondary,
    marginTop: Math.max(2, Math.round(baseUnit * 0.5)),
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricValue: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: Math.max(10, Math.round(baseUnit * 1.1)),
    lineHeight: Math.max(13, Math.round(baseUnit * 1.5)),
    color: '#4B5563',
  },
  metricNumber: {
    fontFamily: Fonts.JUA,
    fontSize: metricNumberFont,
    lineHeight: Math.max(metricNumberFont, Math.round(metricNumberFont * 1.05)),
    color: Colors.textPrimary,
  },
  metricUnit: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: Math.max(10, Math.round(baseUnit * 1.1)),
    lineHeight: Math.max(13, Math.round(baseUnit * 1.5)),
    color: '#6B7280',
  },
  progressTrack: {
    width: Math.max(140, SCREEN_WIDTH * 0.35),
    height: progressHeight,
    borderRadius: progressRadius,
    backgroundColor: Colors.divider,
    marginTop: Math.max(6, Math.round(baseUnit * 1)),
  },
  progressBar: {
    height: progressHeight,
    borderRadius: progressRadius,
    backgroundColor: '#A5B4FC',
  },
  chartHeader: {
    marginTop: Math.max(8, Math.round(baseUnit * 1.2)),
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    paddingVertical: chartPadding,
    paddingHorizontal: chartPadding,
    ...cardShadow,
  },
  chartStyle: {
    borderRadius: chartRadius,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
