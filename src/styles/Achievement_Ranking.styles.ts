import { StyleSheet } from 'react-native';
import { Colors, Fonts, Typography } from './theme';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /**
   * 랭킹
   */
  rankAvatarContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankingNumberImage: { width: 50, height: 50, resizeMode: 'contain' },
  rankingNumberText: {
    fontSize: Typography.h1, // 가독성을 위해 살짝 조절
    fontFamily: Fonts.Pretendard,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  rankingNameScoreContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
  },
  listItemBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingRight: 16,
    paddingLeft: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    minHeight: 70,
  },
  listItemText: {
    fontSize: Typography.bodyLarge,
    fontFamily: Fonts.Pretendard,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rankingFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  rankingFilterButtonText: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    fontFamily: Fonts.Pretendard,
    fontWeight: 'bold',
  },
  rankingFilterButtonActive: {
    backgroundColor: Colors.info,
  },
  rankingFilterButtonTextActive: {
    color: Colors.surface,
  },
  noRankingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noRankingText: {
    fontSize: Typography.h1,
    color: Colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },
  myRankingHighlight: {
    backgroundColor: Colors.accentSoft,
  },
  myRankingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  myRankingFloatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  myRankingText: {
    fontSize: Typography.body,
    fontFamily: Fonts.JUA,
    textAlign: 'center',
    color: Colors.surface,
  },
});
