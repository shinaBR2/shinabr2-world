import {
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { useAddDoc, useGetCollectionOnce } from "../universal/dbQuery";
import { AudioItem } from "./interfaces";

const converter: FirestoreDataConverter<AudioItem> = {
  toFirestore: (data: AudioItem) => {
    const { image, ...rest } = data;

    return {
      ...rest,
      thumbnailUrl: image,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      src: data.src,
      name: data.name,
      artistName: data.artistName,
      image: data.thumbnailUrl,
    };
  },
};

const useGetHomeAudioList = (db: Firestore) => {
  const inputs = {
    db,
    path: "homeConfigs",
    pathSegments: ["listen", "audioList"],
    converter,
  };
  const { values, loading, error } = useGetCollectionOnce(inputs);

  return {
    values,
    loading,
    error,
  };
};

const useUploadHomeAudio = (db: Firestore) => {
  const addFunc = useAddDoc();

  return async (inputs: AudioItem) => {
    const addInputs = {
      db,
      path: "homeConfigs",
      pathSegments: ["listen", "audioList"],
      data: converter.toFirestore(inputs),
    };

    const id = await addFunc(addInputs);

    return id;
  };
};

export { useGetHomeAudioList, useUploadHomeAudio };
