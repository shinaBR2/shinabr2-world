import { FirestoreDataConverter } from "firebase/firestore";

export interface CollectionInputs<T> {
  db: any;
  path: string;
  pathSegments: string[];
  converter: FirestoreDataConverter<T>;
}
