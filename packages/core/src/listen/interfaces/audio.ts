import { FieldValue } from "firebase/firestore";

interface BaseAudio {
  src: string;
  name: string;
  artistName: string;
  image: string;
}

export interface AudioItem extends BaseAudio {
  // id: string;
  // uploaderId: string;
  editorId?: string;
  // createdAt: FieldValue;
  updatedAt?: FieldValue;
}

export interface CreateAudioItemInputs extends BaseAudio {
  uploaderId: string;
}

export interface UpdateAudioItemInputs extends BaseAudio {
  id: string;
  editorId: string;
}
