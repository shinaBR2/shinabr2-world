import { Firestore, FirestoreDataConverter } from "firebase/firestore";

export interface CollectionInputs<T> {
  db: Firestore;
  path: string;
  pathSegments: string[];
  converter: FirestoreDataConverter<T>;
}

export interface AddDocInputs<T = {}> {
  db: Firestore;
  path: string;
  pathSegments: string[];
  data: T;
}
