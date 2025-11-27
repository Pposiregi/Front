import { StyleSheet, Dimensions, Platform } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

// 화면 크기 기반 반응형 사이즈 계산
const BOTTOM_NAV_HEIGHT = 60;
const PROGRESS_CONTAINER_HEIGHT = Math.max(
  80,
  Math.min(120, SCREEN_HEIGHT * 0.12)
);
const TOKKI_PADDING_V = Math.max(12, Math.round(SCREEN_HEIGHT * 0.02));
const TOKKI_PADDING_H = Math.max(12, Math.round(SCREEN_WIDTH * 0.04));
const START_BUTTON_PADDING_H = Math.max(28, Math.round(SCREEN_WIDTH * 0.1));
const START_BUTTON_PADDING_V = Math.max(10, Math.round(SCREEN_HEIGHT * 0.015));
const START_BUTTON_RADIUS = Math.max(18, Math.round(SCREEN_WIDTH * 0.05));
const START_BUTTON_FONT = Math.max(14, Math.round(SCREEN_WIDTH * 0.04));
const CONTENT_MARGIN_BOTTOM = Math.max(12, Math.round(SCREEN_HEIGHT * 0.025));

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fabe4e',
    paddingTop: Platform.select({ ios: 40, android: 24 }),
    paddingBottom: BOTTOM_NAV_HEIGHT, // space for bottom nav
  },
  healthConnectBanner: {
    backgroundColor: '#FFF6DA',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5C86C',
  },
  healthConnectBannerText: {
    color: '#5F3A00',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  healthConnectBannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9900',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  healthConnectBannerButtonLabel: {
    color: '#fff',
    fontWeight: '600',
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
    /* 센서 미지원에 대한 안내 문장용 */
    fontFamily: 'GowunDodum',
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    marginTop: Math.max(4, Math.round(SCREEN_HEIGHT * 0.0002)),
  },
  stepFallback: {
    fontFamily: 'GowunDodum',
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
  },
  tokkiBackground: {
    flex: 1,
    width: '100%',
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
    backgroundColor: '#fff',
    paddingHorizontal: START_BUTTON_PADDING_H,
    paddingVertical: START_BUTTON_PADDING_V,
    borderRadius: START_BUTTON_RADIUS,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  startText: {
    fontFamily: 'JUA',
    fontWeight: 'bold',
    fontSize: START_BUTTON_FONT,
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
});
