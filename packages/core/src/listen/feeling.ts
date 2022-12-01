import {
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import {
  useAddDoc,
  useDeleteDoc,
  useGetCollectionOn,
  useGetCollectionOnce,
  useUpdateDoc,
} from "../universal/dbQuery";
import {
  AudioItem,
  CreateAudioItemInputs,
  CreateFeelingInputs,
  Feeling,
  UpdateAudioItemInputs,
  UpdateFeelingInputs,
} from "./interfaces";

/**
 * Some notes because of TS sucks
 * - `AudioItem` will be the result's type of `fromFirestore` function,
 * which used for frontend to display
 * - All field in the type of `data` of `toFirestore` MUST exist in `AudioItem`
 *
 * Problem:
 * - `AudioItem` contains `id` which can not be existed in `CreateAudioItemInputs`
 */
const converter: FirestoreDataConverter<Feeling> = {
  toFirestore: (data: CreateFeelingInputs) => {
    const { name, value } = data;

    return {
      name,
      value,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      name: data.name,
      value: data.value,
      creatorId: data.creatorId,
      createdAt: data.createdAt,
      editorId: data.editorId,
      updatedAt: data.updatedAt,
    };
  },
};

const useListenHomeFeelingList = (db: Firestore) => {
  const inputs = {
    db,
    path: "homeConfigs",
    pathSegments: ["listen", "feelingList"],
    converter,
  };
  const { values, loading, error } = useGetCollectionOn(inputs);

  return {
    values,
    loading,
    error,
  };
};

const useGetHomeFeelingList = (db: Firestore) => {
  const inputs = {
    db,
    path: "homeConfigs",
    pathSegments: ["listen", "feelingList"],
    converter,
  };
  const { values, loading, error } = useGetCollectionOnce(inputs);

  return {
    values,
    loading,
    error,
  };
};

const useAddHomeFeeling = (db: Firestore) => {
  const addFunc = useAddDoc();

  return async (inputs: CreateFeelingInputs) => {
    const addInputs = {
      db,
      path: "homeConfigs",
      pathSegments: ["listen", "feelingList"],
      data: converter.toFirestore(inputs),
    };

    const id = await addFunc(addInputs);

    return id;
  };
};

const useUpdateHomeFeeling = (db: Firestore) => {
  const udpateFunc = useUpdateDoc();

  return async (inputs: UpdateFeelingInputs) => {
    const { id, ...rest } = inputs;
    const updateInputs = {
      db,
      path: "homeConfigs",
      pathSegments: ["listen", "feelingList", id],
      data: converter.toFirestore(rest),
    };

    await udpateFunc(updateInputs);
  };
};

const useDeleteHomeFeeling = (db: Firestore) => {
  const deleteFunc = useDeleteDoc();

  return async (id: string) => {
    const deleteInputs = {
      db,
      path: "homeConfigs",
      pathSegments: ["listen", "feelingList", id],
    };

    await deleteFunc(deleteInputs);
  };
};

export {
  useListenHomeFeelingList,
  useGetHomeFeelingList,
  useAddHomeFeeling,
  useUpdateHomeFeeling,
  useDeleteHomeFeeling,
};
