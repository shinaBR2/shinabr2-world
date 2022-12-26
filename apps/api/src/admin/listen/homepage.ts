import { onCall, onRequest } from "../../singleton";
import { dbBatchWrite, dbGetRef, dbRead } from "../../singleton/db";

const saveFeelings = async (data: any) => {
  const { feelings } = data;

  console.log(JSON.stringify(feelings));

  return "Success";
};

const withRequest = {
  saveFeelings: onCall(saveFeelings),
};

export default withRequest;
