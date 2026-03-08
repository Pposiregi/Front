import { StyleSheet, Platform } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

// 화면 크기 기반 반응형 사이즈 계산
const BOTTOM_NAV_HEIGHT = 60;
const PROGRESS_CONTAINER_HEIGHT = Math.max(
  80,
  Math.min(120, SCREEN_HEIGHT * 0.1)
);
const TOKKI_PADDING_V = Math.max(12, Math.round(SCREEN_HEIGHT * 0.02));
const TOKKI_PADDING_H = Math.max(12, Math.round(SCREEN_WIDTH * 0.04));
const START_BUTTON_SIZE = Math.max(
  66,
  Math.min(82, Math.round(SCREEN_WIDTH * 0.205))
);
const START_BUTTON_RADIUS = Math.round(START_BUTTON_SIZE / 2);
const START_BUTTON_FONT = Math.max(16, Math.round(SCREEN_WIDTH * 0.045));
const CONTENT_MARGIN_BOTTOM = Math.max(12, Math.round(SCREEN_HEIGHT * 0.025));
const START_BUTTON_BASE_BOTTOM = BOTTOM_NAV_HEIGHT - 20;
const RUN_LOCK_NOTICE_BOTTOM = BOTTOM_NAV_HEIGHT + 2;
const START_BUTTON_ESTIMATED_HEIGHT = START_BUTTON_SIZE;
const PET_BOTTOM_FROM_START =
  START_BUTTON_BASE_BOTTOM + START_BUTTON_ESTIMATED_HEIGHT + 8;
const MISSION_BUTTON_TOP = Math.max(96, Math.round(SCREEN_HEIGHT * 0.125));
const HUD_SURFACE = 'rgba(255, 255, 255, 0.72)';
const START_BUTTON_SURFACE = 'rgba(255, 255, 255, 0.86)';
const RUNNING_NOTICE_BG = 'rgba(254, 194, 136, 0.35)';
const RUNNING_NOTICE_BORDER = 'rgba(254, 194, 136, 0.62)';

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.select({ ios: 40, android: 24 }),
  },
  progressContainer: {
    height: PROGRESS_CONTAINER_HEIGHT,
    marginBottom: CONTENT_MARGIN_BOTTOM,
  },
  progressRow: {
    paddingHorizontal: Spacing.lg,
  },
  missionCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  message: {
    /* 메인 메시지 문구 */
    fontFamily: Fonts.Roboto_VariableFont,
    textAlign: 'center',
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    marginTop: Math.max(4, Math.round(SCREEN_HEIGHT * 0.0002)),
  },
  messageRow: {
    position: 'absolute',
    top: Math.max(148, Math.round(SCREEN_HEIGHT * 0.2)),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    zIndex: 6,
  },
  devButtonGroup: {
    position: 'absolute',
    left: Math.max(Spacing.md, Math.round(SCREEN_WIDTH * 0.035)),
    bottom: BOTTOM_NAV_HEIGHT + Math.max(2, Math.round(SCREEN_HEIGHT * 0.006)),
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    zIndex: 12,
  },
  mainBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: TOKKI_PADDING_V,
    paddingBottom: TOKKI_PADDING_V,
    paddingHorizontal: TOKKI_PADDING_H,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  runHud: {
    zIndex: 2,
    position: 'absolute',
    top: Math.round(SCREEN_HEIGHT * 0.05),
    left: -TOKKI_PADDING_H,
    right: -TOKKI_PADDING_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runHudInner: {
    width: '100%',
    minHeight: Math.max(58, Math.round(SCREEN_HEIGHT * 0.07)),
    paddingHorizontal: Math.max(16, Math.round(SCREEN_WIDTH * 0.045)),
    paddingVertical: 6,
    borderRadius: 0,
    backgroundColor: HUD_SURFACE,
    ...Shadows.soft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runTimerValue: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(Typography.timer, Math.round(SCREEN_WIDTH * 0.108)),
    color: Colors.textPrimary,
    letterSpacing: 1,
    lineHeight: Math.max(42, Math.round(SCREEN_WIDTH * 0.112)),
    textAlign: 'center',
  },
  runBgScroller: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 0,
  },
  runBgTile: {
    height: '100%',
    marginTop: '0%',
  },
  startButton: {
    position: 'absolute',
    bottom: START_BUTTON_BASE_BOTTOM,
    alignSelf: 'center',
    width: START_BUTTON_SIZE,
    height: START_BUTTON_SIZE,
    borderRadius: START_BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: Shadows.medium,
      android: { elevation: 0 },
    }),
  },
  fatButton: {
    position: 'absolute',
    bottom: BOTTOM_NAV_HEIGHT - 16,
    left: '50%',
    marginLeft: Math.max(90, Math.round(SCREEN_WIDTH * 0.24)),
    backgroundColor: Colors.devButton,
    paddingHorizontal: Spacing.md - 2,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.md,
  },
  startButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: START_BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: START_BUTTON_SURFACE,
    overflow: 'hidden',
    ...Platform.select({
      android: Shadows.medium,
    }),
  },
  runningLockNotice: {
    position: 'absolute',
    right: Spacing.md,
    bottom: RUN_LOCK_NOTICE_BOTTOM,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 1,
    borderRadius: Radius.pill,
    backgroundColor: RUNNING_NOTICE_BG,
    borderWidth: 1,
    borderColor: RUNNING_NOTICE_BORDER,
  },
  startText: {
    fontFamily: Fonts.JUA,
    fontWeight: 'bold',
    fontSize: START_BUTTON_FONT,
    color: Colors.textSecondary,
  },
  startIcon: {
    width: Math.max(50, Math.round(SCREEN_WIDTH * 0.14)),
    height: Math.max(50, Math.round(SCREEN_WIDTH * 0.14)),
  },
  devHealthButton: {
    backgroundColor: Colors.devButton,
    paddingHorizontal: Spacing.md - 2,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.md,
  },
  devHealthButtonText: {
    color: Colors.surface,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  pet: {
    position: 'absolute',
    bottom: PET_BOTTOM_FROM_START,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  petImage: {
    alignSelf: 'center',
  },
  running_pet: {
    position: 'absolute',
    bottom: PET_BOTTOM_FROM_START,
    alignSelf: 'center',
    resizeMode: 'contain',
    zIndex: 2,
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  countdownText: {
    fontSize: Typography.display,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  emptyMissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMissionText: {
    fontSize: Typography.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  missionButton: {
    position: 'absolute',
    top: MISSION_BUTTON_TOP,
    right: Math.max(Spacing.md + 2, Math.round(SCREEN_WIDTH * 0.04)),
    width: 46,
    height: 46,
    padding: Spacing.sm,
    backgroundColor: Colors.accentStrong,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.accent,
    zIndex: 10,
  },
  missionIcon: {
    width: 30,
    height: 30,
  },
});
