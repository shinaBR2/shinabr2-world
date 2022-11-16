interface BaseAudioItem {
  src: string;
  name: string;
  artistName: string;
  image: string;
}

export interface AudioItem extends BaseAudioItem {
  id: string;
}

// Backend interface starts with B
export interface CRUDAudioItemInputs extends BaseAudioItem {
  //
}
