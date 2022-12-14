interface BaseAudio {
  src: string;
  name: string;
  artistName: string;
  image: string;
  feelingMap: {
    [feelingId: string]: boolean;
  };
  uploaderId: string;
  editorId?: string;
  createdAt: Object;
  updatedAt?: Object;
}

export interface AudioItem extends BaseAudio {
  id: string;
}
