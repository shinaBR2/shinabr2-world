interface BaseFeeling {
  name: string;
  value: string;
}

export interface Feeling extends BaseFeeling {
  id: string;
  creatorId: string;
  editorId?: string;
  createdAt: Object;
  updatedAt?: Object;
}

export interface CreateFeelingInputs extends BaseFeeling {
  creatorId: string;
}

export interface UpdateFeelingInputs extends BaseFeeling {
  id: string;
  editorId: string;
}
