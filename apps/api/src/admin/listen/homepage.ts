import pw from "a-promise-wrapper";
import { CallableContext } from "firebase-functions/v1/https";
import { onCall, onRequest } from "../../singleton";
import { dbBatchWrite, dbGetRef, dbRead } from "../../singleton/db";
import { AppError, onAdminCall } from "../../singleton/request";
import { saveHomepageFeelings } from "./helpers";

const saveFeelings = async (data: any) => {
  const { feelings } = data;

  console.log(JSON.stringify(feelings));

  const { error } = await pw(saveHomepageFeelings(data));

  if (error) {
    throw AppError("Can not save homepage feelings");
  }

  return "Success";
};

const withRequest = {
  saveFeelings: onAdminCall(saveFeelings),
};

export default withRequest;
