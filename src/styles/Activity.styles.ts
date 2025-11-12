import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from './dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  monthHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontFamily: 'JUA',
    fontSize: 27,
    color: '#2B2B2B',
    textAlign: 'center',
    flex: 1,
  },
  arrowButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  arrowText: {
    fontSize: 24,
    color: '#555',
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'JUA',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    color: '#555',
    marginRight: 20,
    fontFamily: 'JUA',
  },
  distanceText: {
    fontSize: 18,
    color: '#007aff',
    fontFamily: 'JUA',
    marginLeft: 'auto',
  },
  detailLink: {
    fontSize: 22,
    color: '#aaa',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  indexText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
  chartMaskContainer: {
    overflow: 'hidden',
  },
  lineChartShiftStyle: {
    marginLeft: -SCREEN_WIDTH * 0.13,
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 24,
    fontFamily: 'JUA',
    textAlign: 'center',
    marginTop: 20,
    color: '#2B2B2B',
  },
  loadingIndicator: {
    marginTop: 30,
    marginBottom: 20,
  },
  noActivityText: {
    fontFamily: 'JUA',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
});
