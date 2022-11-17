import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { AddDocInputs, CollectionInputs } from "./interfaces";

const useGetCollectionOnce = <T>(inputs: CollectionInputs<T>) => {
  const { db, path, pathSegments, converter } = inputs;
  const query = collection(db, path, ...pathSegments);
  const ref = query.withConverter(converter);
  const [values, loading, error] = useCollectionDataOnce(ref);

  return {
    values,
    loading,
    error,
  };
};

const useAddDoc = () => {
  return async (inputs: AddDocInputs) => {
    const { db, path, pathSegments, data } = inputs;

    const writeData = {
      ...data,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(
      collection(db, path, ...pathSegments),
      writeData
    );

    return docRef.id;
  };
};

export { useGetCollectionOnce, useAddDoc };
