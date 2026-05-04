import { StyleSheet, Platform } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import {
  bottomContentPadding,
  cardRadius,
  Colors,
  Fonts,
  layoutScale,
  Radius,
  screenPadding,
  Shadows,
  Spacing,
  Typography,
} from './theme';

// 화면 크기 기반 반응형 사이즈 계산
const BOTTOM_NAV_HEIGHT = layoutScale(64, 56, 76);
const PROGRESS_CONTAINER_HEIGHT = Math.max(
  layoutScale(82, 76, 96),
  Math.min(layoutScale(112, 96, 124), SCREEN_HEIGHT * 0.1)
);
const TOKKI_PADDING_V = layoutScale(14, 12, 18);
const TOKKI_PADDING_H = screenPadding;
const CONTAINER_TOP_PADDING = Platform.select({
  ios: layoutScale(40, 34, 52),
  android: layoutScale(24, 20, 32),
  default: layoutScale(24, 20, 32),
});
const START_BUTTON_SIZE = Math.max(
  layoutScale(68, 64, 72),
  Math.min(layoutScale(82, 76, 88), Math.round(SCREEN_WIDTH * 0.205))
);
const START_BUTTON_RADIUS = Math.round(START_BUTTON_SIZE / 2);
const START_BUTTON_FONT = layoutScale(17, 16, 19);
const CONTENT_MARGIN_BOTTOM = layoutScale(16, 12, 22);
const START_BUTTON_BASE_BOTTOM = Math.max(
  Math.round(BOTTOM_NAV_HEIGHT * 0.66),
  BOTTOM_NAV_HEIGHT - layoutScale(16, 14, 22)
);
const RUN_LOCK_NOTICE_BOTTOM = BOTTOM_NAV_HEIGHT + 2;
const START_BUTTON_ESTIMATED_HEIGHT = START_BUTTON_SIZE;
const PET_BOTTOM_FROM_START =
  START_BUTTON_BASE_BOTTOM +
  START_BUTTON_ESTIMATED_HEIGHT +
  layoutScale(8, 6, 12);
const MISSION_BUTTON_TOP = layoutScale(104, 96, 124);
const MESSAGE_MARGIN_TOP = layoutScale(5, 4, 8);
const MESSAGE_ROW_TOP = layoutScale(124, 112, 148);
const RUN_HUD_TOP = layoutScale(36, 28, 46);
const RUN_HUD_MIN_HEIGHT = layoutScale(62, 58, 72);
const RUN_HUD_HORIZONTAL_PADDING = screenPadding;
const RUN_HUD_VERTICAL_PADDING = layoutScale(7, 6, 9);
const TIMER_LINE_HEIGHT = layoutScale(44, 42, 50);
const START_ICON_SIZE = layoutScale(54, 50, 60);
const DEV_BUTTON_STACK_BOTTOM =
  BOTTOM_NAV_HEIGHT + layoutScale(4, 2, 6);
const DEV_BUTTON_HORIZONTAL_PADDING = layoutScale(11, 10, 14);
const DEV_BUTTON_VERTICAL_PADDING = layoutScale(7, 6, 9);
const RUN_LOCK_NOTICE_RIGHT = screenPadding;
const RUN_LOCK_NOTICE_HORIZONTAL_PADDING = layoutScale(13, Spacing.md, 16);
const RUN_LOCK_NOTICE_VERTICAL_PADDING = layoutScale(8, 7, 10);
const MISSION_BUTTON_SIZE = Math.max(
  layoutScale(44, 42, 48),
  Math.min(layoutScale(52, 48, 56), Math.round(SCREEN_WIDTH * 0.12))
);
const MISSION_BUTTON_PADDING = Math.max(
  Spacing.sm,
  layoutScale(Math.round(MISSION_BUTTON_SIZE * 0.17), 8, 10)
);
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
    zIndex: 1,
    ...Shadows.surfaceFlat,
  },
  progressRow: {
    paddingHorizontal: screenPadding,
  },
  missionCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  message: {
    /* 메인 메시지 문구 */
    fontFamily: Fonts.JUA,
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
    left: screenPadding,
    bottom: DEV_BUTTON_STACK_BOTTOM,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    zIndex: 12,
  },
  devToggleButton: {
    backgroundColor: Colors.surfaceOverlaySolid,
    paddingHorizontal: DEV_BUTTON_HORIZONTAL_PADDING,
    paddingVertical: DEV_BUTTON_VERTICAL_PADDING,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
    ...Shadows.surfaceRaised,
  },
  devToggleText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  mainBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: TOKKI_PADDING_V,
    paddingBottom: bottomContentPadding,
    paddingHorizontal: TOKKI_PADDING_H,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: cardRadius,
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
    ...Shadows.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runTimerValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: layoutScale(Typography.timer, Typography.timer, 46),
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
      ios: Shadows.floatingAction,
      android: Shadows.surfaceFlat,
    }),
  },
  fatButton: {
    position: 'absolute',
    bottom: Math.max(Spacing.sm, BOTTOM_NAV_HEIGHT - layoutScale(16, 12, 20)),
    left: '50%',
    marginLeft: layoutScale(96, 90, 112),
    backgroundColor: Colors.devButton,
    paddingHorizontal: DEV_BUTTON_HORIZONTAL_PADDING,
    paddingVertical: DEV_BUTTON_VERTICAL_PADDING,
    borderRadius: Radius.md,
  },
  devPbfPanel: {
    minWidth: layoutScale(164, 156, 184),
    paddingHorizontal: DEV_BUTTON_HORIZONTAL_PADDING,
    paddingVertical: DEV_BUTTON_VERTICAL_PADDING,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceOverlaySolid,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
    gap: Spacing.xs,
  },
  devPbfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  devPbfTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  devPbfResetButton: {
    paddingHorizontal: layoutScale(8, 8, 10),
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accentSoft,
  },
  devPbfResetText: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  devPbfBar: {
    height: 16,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceBorderOverlay,
    overflow: 'visible',
    justifyContent: 'center',
  },
  devPbfBarFill: {
    height: '100%',
    borderRadius: Radius.pill,
    backgroundColor: Colors.devButton,
  },
  devPbfBarThumb: {
    position: 'absolute',
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.devButton,
  },
  devPbfScaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  devPbfScaleText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    fontWeight: '600',
  },
  devPbfControls: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  devPbfAdjustButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.devButton,
    alignItems: 'center',
  },
  devPbfAdjustText: {
    color: Colors.surface,
    fontSize: Typography.caption,
    fontWeight: '700',
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
      android: Shadows.floatingAction,
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
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
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
    bottom: 0,
    alignSelf: 'center',
    resizeMode: 'contain',
    zIndex: 2,
  },
  runningPetLayer: {
    position: 'absolute',
    bottom: PET_BOTTOM_FROM_START,
    alignSelf: 'center',
    zIndex: 2,
  },
  runningLegSwirl: {
    position: 'absolute',
    zIndex: 10,
    opacity: 0.88,
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
    right: screenPadding,
    width: MISSION_BUTTON_SIZE,
    height: MISSION_BUTTON_SIZE,
    padding: MISSION_BUTTON_PADDING,
    backgroundColor: Colors.accentStrong,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.floatingAction,
    zIndex: 10,
  },
  missionIcon: {
    width: MISSION_ICON_SIZE,
    height: MISSION_ICON_SIZE,
  },
  /**
   * 펫 관련
   */
  petOnboardingOverlay: {
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

  petOnboardingCard: {
    width: '80%',
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    padding: screenPadding,
    alignItems: 'center',
  },

  petOnboardingTitle: {
    fontSize: Typography.cardTitle,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: Fonts.Pretendard,
  },

  petTypeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  petTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    borderRadius: 10,
  },

  petOnboardingStart: {
    backgroundColor: Colors.devButton,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
  },

  runningStatPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSoft,
    borderRadius: cardRadius,
    borderWidth: 1,
    borderColor: Colors.accent,
    marginHorizontal: screenPadding,
    paddingVertical: 12,
  },

  runningStatPanelItem: {
    flex: 1,
    alignItems: 'center',
  },

  runningStatPanelDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.accent,
  },

  runningStatPanelLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
    marginBottom: 2,
  },

  runningStatPanelValue: {
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },

  runningStatPanelUnit: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontFamily: Fonts.Pretendard,
    marginTop: 2,
  },
});
