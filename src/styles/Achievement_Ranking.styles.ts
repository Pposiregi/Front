import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows, Spacing, Typography } from './theme';

export const styles = StyleSheet.create({
  rankingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  rankingBackgroundImage: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  rankingTopSpacer: {
    height: 72,
  },
  rankingScroll: {
    flex: 1,
  },
  rankingList: {
    paddingHorizontal: Spacing.md,
  },
  rankingListToolbar: {
    minHeight: 38,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankingListToolbarLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    fontWeight: '800',
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surfaceOverlaySolid,
    borderRadius: 16,
    paddingRight: 16,
    paddingLeft: 4,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
    ...Shadows.surfaceRaised,
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
    alignSelf: 'center',
  },
  rankingFilterButton: {
    minWidth: 48,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
    borderRadius: 8,
    backgroundColor: Colors.backgroundOverlaySolid,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
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
  myRankingFloatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  myRankingTitle: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceOverlaySolid,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    fontWeight: '800',
  },
});
