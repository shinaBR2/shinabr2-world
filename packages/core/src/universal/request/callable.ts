import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const callable = (name: string, data: any) => {
  return httpsCallable(functions, name)(data);
};

export default callable;
