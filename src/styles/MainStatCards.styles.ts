import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

export default StyleSheet.create({
  metricLayer: {
    position: 'absolute',
    left: Math.max(10, Math.round(SCREEN_WIDTH * 0.03)),
    right: Math.max(10, Math.round(SCREEN_WIDTH * 0.03)),
    top: Math.max(40, Math.round(SCREEN_HEIGHT * 0.055)),
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
  },
  metricCardShell: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
  },
  metricCardShellPrimary: {
    flex: 1.5,
    minHeight: 72,
  },
  metricCard: {
    flex: 1,
    minHeight: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  metricCardPrimary: {
    flex: 1,
    minHeight: 72,
    paddingVertical: 8,
  },
  metricLabel: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'JUA',
    fontSize: Math.max(16, Math.round(SCREEN_WIDTH * 0.045)),
    color: '#334155',
    lineHeight: Math.max(19, Math.round(SCREEN_WIDTH * 0.052)),
    includeFontPadding: false,
  },
  metricValuePrimary: {
    fontFamily: 'JUA',
    fontSize: Math.max(22, Math.round(SCREEN_WIDTH * 0.058)),
    color: '#1F2937',
    lineHeight: Math.max(26, Math.round(SCREEN_WIDTH * 0.064)),
    includeFontPadding: false,
  },
});
