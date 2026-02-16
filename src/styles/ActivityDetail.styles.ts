import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

const colors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  divider: '#E5E7EB',
  chipBackground: 'rgba(17, 24, 39, 0.75)',
  chipText: '#FFFFFF',
  shadow: '#000000',
};

const cardShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Roboto-VariableFont',
  },
  mapFrame: {
    height: SCREEN_HEIGHT * 0.36,
    width: SCREEN_WIDTH - 40,
    borderRadius: 18,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: 16,
    ...cardShadow,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapRelocatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  mapRelocatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  mapRelocatingText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: 'Roboto-VariableFont',
  },
  chip: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.chipText,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: 'JUA',
    color: colors.textPrimary,
  },
  specCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  specLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Roboto-VariableFont',
  },
  specValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'JUA',
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  mapBlocker: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Roboto-VariableFont',
  },
});
