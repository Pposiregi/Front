import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts } from './theme';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 5;
const CARD_MARGIN = 20;
const CARD_PADDING = 14;
const ITEM_WIDTH = (width - CARD_MARGIN * 2 - CARD_PADDING * 2) / COLUMN_COUNT;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  badgeCard: {
    marginTop: 15,
    backgroundColor: Colors.surface,
    padding: CARD_PADDING,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
    elevation: 3,
    marginHorizontal: CARD_MARGIN,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  badgeTitle: {
    fontSize: 20,
    fontFamily: Fonts.JUA,
    color: '#333',
  },
  badgeCount: {
    fontSize: 14,
    fontFamily: Fonts.JUA,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  badgeItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeIcon: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    resizeMode: 'contain',
  },
  lockedIcon: {
    opacity: 0.4,
  },
});
