import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    fontFamily: 'GowunDodum',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'JUA',
    fontWeight: 'normal',
    color: '#1F2937',
  },
  dataCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataLabel: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'JUA',
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'GowunDodum',
    fontWeight: '600',
  },
  mapPlaceholder: {
    marginBottom: 10,
    padding: 14,
    backgroundColor: '#e8e8e8',
    textAlign: 'center',
    color: '#333',
    fontSize: 18,
    fontFamily: 'JUA',
    borderRadius: 8,
  },
  map: {
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH * 0.8,
  },
  mapBlocker: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 15,
    color: '#555',
    fontFamily: 'GowunDodum',
  },
});
