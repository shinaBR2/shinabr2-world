export interface FeatureFlagItem {
  isGlobal: boolean;
  allowUserIds: {
    [userId: string]: boolean;
  };
}
