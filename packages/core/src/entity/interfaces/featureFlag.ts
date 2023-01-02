export interface FeatureFlagItem {
  isGlobal: boolean;
  allowedUserIds: {
    [userId: string]: boolean;
  };
}
