import { StyleSheet, Platform } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

// 화면 크기 기반 반응형 사이즈 계산
const BOTTOM_NAV_HEIGHT = Math.max(56, Math.round(SCREEN_HEIGHT * 0.075));
const PROGRESS_CONTAINER_HEIGHT = Math.max(
  80,
  Math.min(120, SCREEN_HEIGHT * 0.1)
);
const TOKKI_PADDING_V = Math.max(12, Math.round(SCREEN_HEIGHT * 0.02));
const TOKKI_PADDING_H = Math.max(12, Math.round(SCREEN_WIDTH * 0.04));
const CONTAINER_TOP_PADDING = Platform.select({
  ios: Math.max(34, Math.round(SCREEN_HEIGHT * 0.05)),
  android: Math.max(20, Math.round(SCREEN_HEIGHT * 0.03)),
  default: Math.max(20, Math.round(SCREEN_HEIGHT * 0.03)),
});
const START_BUTTON_SIZE = Math.max(
  66,
  Math.min(82, Math.round(SCREEN_WIDTH * 0.205))
);
const START_BUTTON_RADIUS = Math.round(START_BUTTON_SIZE / 2);
const START_BUTTON_FONT = Math.max(16, Math.round(SCREEN_WIDTH * 0.045));
const CONTENT_MARGIN_BOTTOM = Math.max(12, Math.round(SCREEN_HEIGHT * 0.025));
const START_BUTTON_BASE_BOTTOM = Math.max(
  Math.round(BOTTOM_NAV_HEIGHT * 0.66),
  BOTTOM_NAV_HEIGHT - Math.max(14, Math.round(SCREEN_HEIGHT * 0.025))
);
const RUN_LOCK_NOTICE_BOTTOM = BOTTOM_NAV_HEIGHT + 2;
const START_BUTTON_ESTIMATED_HEIGHT = START_BUTTON_SIZE;
const PET_BOTTOM_FROM_START =
  START_BUTTON_BASE_BOTTOM +
  START_BUTTON_ESTIMATED_HEIGHT +
  Math.max(6, Math.round(SCREEN_HEIGHT * 0.01));
const MISSION_BUTTON_TOP = Math.max(96, Math.round(SCREEN_HEIGHT * 0.125));
const MESSAGE_MARGIN_TOP = Math.max(4, Math.round(SCREEN_HEIGHT * 0.006));
const MESSAGE_ROW_TOP = Math.max(112, Math.round(SCREEN_HEIGHT * 0.15));
const RUN_HUD_TOP = Math.max(28, Math.round(SCREEN_HEIGHT * 0.05));
const RUN_HUD_MIN_HEIGHT = Math.max(58, Math.round(SCREEN_HEIGHT * 0.07));
const RUN_HUD_HORIZONTAL_PADDING = Math.max(
  Spacing.lg,
  Math.round(SCREEN_WIDTH * 0.045)
);
const RUN_HUD_VERTICAL_PADDING = Math.max(Spacing.sm - 2, Math.round(SCREEN_HEIGHT * 0.007));
const TIMER_LINE_HEIGHT = Math.max(42, Math.round(SCREEN_WIDTH * 0.112));
const START_ICON_SIZE = Math.max(50, Math.round(SCREEN_WIDTH * 0.14));
const DEV_BUTTON_STACK_BOTTOM = BOTTOM_NAV_HEIGHT + Math.max(2, Math.round(SCREEN_HEIGHT * 0.006));
const DEV_BUTTON_HORIZONTAL_PADDING = Math.max(10, Math.round(SCREEN_WIDTH * 0.028));
const DEV_BUTTON_VERTICAL_PADDING = Math.max(6, Math.round(SCREEN_HEIGHT * 0.008));
const RUN_LOCK_NOTICE_RIGHT = Math.max(Spacing.md, Math.round(SCREEN_WIDTH * 0.03));
const RUN_LOCK_NOTICE_HORIZONTAL_PADDING = Math.max(
  Spacing.md,
  Math.round(SCREEN_WIDTH * 0.03)
);
const RUN_LOCK_NOTICE_VERTICAL_PADDING = Math.max(7, Math.round(SCREEN_HEIGHT * 0.009));
const MISSION_BUTTON_SIZE = Math.max(44, Math.min(52, Math.round(SCREEN_WIDTH * 0.12)));
const MISSION_BUTTON_PADDING = Math.max(Spacing.sm, Math.round(MISSION_BUTTON_SIZE * 0.17));
const MISSION_ICON_SIZE = Math.max(28, Math.round(MISSION_BUTTON_SIZE * 0.65));

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
    paddingTop: CONTAINER_TOP_PADDING,
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
    marginTop: MESSAGE_MARGIN_TOP,
  },
  messageRow: {
    position: 'absolute',
    top: MESSAGE_ROW_TOP,
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
    bottom: DEV_BUTTON_STACK_BOTTOM,
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
    top: RUN_HUD_TOP,
    left: -TOKKI_PADDING_H,
    right: -TOKKI_PADDING_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runHudInner: {
    width: '100%',
    minHeight: RUN_HUD_MIN_HEIGHT,
    paddingHorizontal: RUN_HUD_HORIZONTAL_PADDING,
    paddingVertical: RUN_HUD_VERTICAL_PADDING,
    borderRadius: 0,
    backgroundColor: Colors.surfaceOverlay,
    ...Shadows.soft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runTimerValue: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(Typography.timer, Math.round(SCREEN_WIDTH * 0.108)),
    color: Colors.textPrimary,
    letterSpacing: 1,
    lineHeight: TIMER_LINE_HEIGHT,
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
    marginTop: 0,
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
    bottom: Math.max(Spacing.sm, BOTTOM_NAV_HEIGHT - Math.round(SCREEN_HEIGHT * 0.02)),
    left: '50%',
    marginLeft: Math.max(90, Math.round(SCREEN_WIDTH * 0.24)),
    backgroundColor: Colors.devButton,
    paddingHorizontal: DEV_BUTTON_HORIZONTAL_PADDING,
    paddingVertical: DEV_BUTTON_VERTICAL_PADDING,
    borderRadius: Radius.md,
  },
  startButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: START_BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceOverlaySolid,
    overflow: 'hidden',
    ...Platform.select({
      android: Shadows.medium,
    }),
  },
  runningLockNotice: {
    position: 'absolute',
    right: RUN_LOCK_NOTICE_RIGHT,
    bottom: RUN_LOCK_NOTICE_BOTTOM,
    paddingHorizontal: RUN_LOCK_NOTICE_HORIZONTAL_PADDING,
    paddingVertical: RUN_LOCK_NOTICE_VERTICAL_PADDING,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  startText: {
    fontFamily: Fonts.JUA,
    fontWeight: 'bold',
    fontSize: START_BUTTON_FONT,
    color: Colors.textSecondary,
  },
  startIcon: {
    width: START_ICON_SIZE,
    height: START_ICON_SIZE,
  },
  devHealthButton: {
    backgroundColor: Colors.devButton,
    paddingHorizontal: DEV_BUTTON_HORIZONTAL_PADDING,
    paddingVertical: DEV_BUTTON_VERTICAL_PADDING,
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
    width: MISSION_BUTTON_SIZE,
    height: MISSION_BUTTON_SIZE,
    padding: MISSION_BUTTON_PADDING,
    backgroundColor: Colors.accentStrong,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.accent,
    zIndex: 10,
  },
  missionIcon: {
    width: MISSION_ICON_SIZE,
    height: MISSION_ICON_SIZE,
  },
});
