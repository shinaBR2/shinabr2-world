import {
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { useGetCollectionOn, useUpdateDoc } from "../universal/dbQuery";
import { PathConfigs } from "../universal/dbQuery/interfaces";
import { FeatureFlagItem } from "./interfaces/featureFlag";

const featureFlagConverter: FirestoreDataConverter<FeatureFlagItem> = {
  toFirestore: (data) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options) as FeatureFlagItem;

    return data;
  },
};

const useListenFeatureFlag = (db: Firestore, config: PathConfigs) => {
  const inputs = {
    db,
    ...config,
    converter: featureFlagConverter,
  };
  const { values, loading, error } = useGetCollectionOn(inputs);

  return {
    values,
    loading,
    error,
  };
};

const useSaveFeatureFlag = (
  db: Firestore,
  config: PathConfigs,
  data: FeatureFlagItem
) => {
  const udpateFunc = useUpdateDoc();

  return async (inputs: FeatureFlagItem) => {
    const updateInputs = {
      db,
      ...config,
      data: featureFlagConverter.toFirestore(inputs),
    };

    await udpateFunc(updateInputs);
  };
};

export { featureFlagConverter, useListenFeatureFlag, useSaveFeatureFlag };
