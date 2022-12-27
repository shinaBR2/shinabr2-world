import { CallableContext } from "firebase-functions/v1/https";
import { onCall, onRequest } from "../../singleton";
import { dbBatchWrite, dbGetRef, dbRead } from "../../singleton/db";

const saveFeelings = async (data: any, context: CallableContext) => {
  const { feelings } = data;

  console.log(JSON.stringify(feelings));

  return "Success";
};

const withRequest = {
  saveFeelings: onCall(saveFeelings),
};

export default withRequest;
