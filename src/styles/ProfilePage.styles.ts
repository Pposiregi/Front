import { Platform, StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from './dimensions';

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 4,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF8EC',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 6, android: 6 }),
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFE1B8',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  avatarEmoji: {
    fontSize: 46,
  },
  gearButton: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFB454',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  gearText: {
    fontSize: 18,
  },
  name: {
    marginTop: 10,
    fontFamily: 'JUA',
    fontSize: 20,
    color: '#1F2937',
  },
  caption: {
    marginTop: 6,
    fontFamily: 'GowunDodum',
    fontSize: 13,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: '#1F2937',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recordIcon: {
    marginRight: 6,
  },
  recordText: {
    fontFamily: 'GowunDodum',
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  metricCardSingle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  metricLabel: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: '#111827',
  },
  metricAim: {
    fontFamily: 'GowunDodum',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricValue: {
    fontFamily: 'GowunDodum',
    fontSize: 13,
    color: '#4B5563',
  },
  metricNumber: {
    fontFamily: 'JUA',
    fontSize: 22,
    color: '#111827',
  },
  metricUnit: {
    fontFamily: 'GowunDodum',
    fontSize: 13,
    color: '#6B7280',
  },
  progressTrack: {
    width: Math.max(140, SCREEN_WIDTH * 0.35),
    height: 8,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 10,
    backgroundColor: '#A5B4FC',
  },
  chartHeader: {
    marginTop: 10,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  chartStyle: {
    borderRadius: 12,
  },
});
