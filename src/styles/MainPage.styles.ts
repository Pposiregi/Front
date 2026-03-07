import { StyleSheet, Platform } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

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

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F8',
    paddingTop: Platform.select({ ios: 40, android: 24 }),
  },
  progressContainer: {
    height: PROGRESS_CONTAINER_HEIGHT,
    marginBottom: CONTENT_MARGIN_BOTTOM,
  },
  progressRow: {
    paddingHorizontal: 16,
  },
  missionCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  message: {
    /* 메인 메시지 문구 */
    fontFamily: 'Roboto-VariableFont',
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 24,
    marginTop: Math.max(4, Math.round(SCREEN_HEIGHT * 0.0002)),
  },
  messageRow: {
    position: 'absolute',
    top: Math.max(148, Math.round(SCREEN_HEIGHT * 0.2)),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 6,
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
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    backgroundColor: '#FFFFFFEE',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  locateText: {
    fontFamily: 'Roboto-VariableFont',
    fontWeight: '600',
    fontSize: 12,
    color: '#1F1F1F',
  },
  currentPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(116, 80, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7450FF',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  overlayText: {
    color: '#fff',
    fontFamily: 'Roboto-VariableFont',
    fontSize: 14,
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
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  runTimerValue: {
    fontFamily: 'JUA',
    fontSize: Math.max(40, Math.round(SCREEN_WIDTH * 0.108)),
    color: '#1E3A5F',
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
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 7,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  startButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: START_BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 7,
      },
    }),
  },
  runningLockNotice: {
    position: 'absolute',
    right: 12,
    bottom: RUN_LOCK_NOTICE_BOTTOM,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(254, 194, 136, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(254, 194, 136, 0.62)',
  },
  runningLockNoticeText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 10,
    fontWeight: '600',
    color: '#7A3E00',
    letterSpacing: 0.2,
  },
  startText: {
    fontFamily: 'JUA',
    fontWeight: 'bold',
    fontSize: START_BUTTON_FONT,
    color: '#5B2D00',
  },
  startIcon: {
    width: Math.max(50, Math.round(SCREEN_WIDTH * 0.14)),
    height: Math.max(50, Math.round(SCREEN_WIDTH * 0.14)),
  },
  devHealthButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  devHealthButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  countdownText: {
    fontSize: 90,
    color: 'white',
    fontWeight: 'bold',
  },
  emptyMissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMissionText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
  missionButton: {
    position: 'absolute',
    top: Math.max(108, Math.round(SCREEN_HEIGHT * 0.145)),
    right: 15, // 오른쪽 여백
    width: 50,
    height: 50,
    padding: 10,
    backgroundColor: 'rgba(235, 158, 158, 0.88)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7A2E2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  missionIcon: {
    width: 34,
    height: 34,
  },
});
