import { CallableContext } from "firebase-functions/v1/https";
import { onCall, onRequest } from "../../singleton";
import { dbBatchWrite, dbGetRef, dbRead } from "../../singleton/db";
import { onAdminCall } from "../../singleton/request";

const saveFeelings = async (data: any) => {
  const { feelings } = data;

  console.log(JSON.stringify(feelings));

  return "Success";
};

const withRequest = {
  saveFeelings: onAdminCall(saveFeelings),
};

export default withRequest;
