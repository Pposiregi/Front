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
const START_BUTTON_PADDING_H = Math.max(28, Math.round(SCREEN_WIDTH * 0.1));
const START_BUTTON_PADDING_V = Math.max(10, Math.round(SCREEN_HEIGHT * 0.015));
const START_BUTTON_RADIUS = Math.max(18, Math.round(SCREEN_WIDTH * 0.05));
const START_BUTTON_FONT = Math.max(14, Math.round(SCREEN_WIDTH * 0.04));
const CONTENT_MARGIN_BOTTOM = Math.max(12, Math.round(SCREEN_HEIGHT * 0.025));

const PET_WIDTH = SCREEN_WIDTH * 0.45;
const PET_HEIGHT = PET_WIDTH * 0.6;

export default StyleSheet.create({
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
    fontFamily: 'GowunDodum',
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 24,
    marginTop: Math.max(4, Math.round(SCREEN_HEIGHT * 0.0002)),
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontFamily: 'GowunDodum',
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
    fontFamily: 'GowunDodum',
    fontSize: 14,
  },
  startButton: {
    position: 'absolute',
    bottom: BOTTOM_NAV_HEIGHT - 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: START_BUTTON_PADDING_H,
    paddingVertical: START_BUTTON_PADDING_V,
    borderRadius: START_BUTTON_RADIUS,
  },
  startText: {
    fontFamily: 'JUA',
    fontWeight: 'bold',
    fontSize: START_BUTTON_FONT,
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
    bottom: SCREEN_WIDTH * 0.15,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  petImage: {
    width: PET_WIDTH * 1,
    height: PET_HEIGHT * 2.5,
  },
  running_pet: {
    position: 'absolute',
    bottom: SCREEN_WIDTH * 0.25,
    width: PET_WIDTH * 2,
    height: PET_HEIGHT * 2,
    left: (SCREEN_WIDTH - PET_WIDTH * 2) / 2,
    resizeMode: 'contain',
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
    top: 15, // 상단 여백
    right: 15, // 오른쪽 여백
    width: 50,
    height: 50,
    padding: 10,
    backgroundColor: '#ca4949',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  missionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  /**
   * 미션 UI
   */
  missionView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '95%',
    height: '83%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  missionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderBottomColor: '#2196F3',
    alignItems: 'center',
  },
  missionUICard: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  missionUICardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionUITextTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  missionUIText: {
    fontSize: 16,
    color: '#555',
  },
  missionUIExitButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionUIExitText: {
    color: '#fff',
    fontSize: 20,
  },
});
