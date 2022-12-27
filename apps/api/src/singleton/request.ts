import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

const functionConfig = {
  region: "asia-south1",
};
const functionBuilder = functions.region(functionConfig.region);

const onRequest = functionBuilder.https.onRequest;
const onCall = functionBuilder.https.onCall;
const onAdminCall = (handler: (data: any) => void) => {
  return onCall((data, context) => {
    // Check context
    const { auth } = context;

    if (!auth) {
      throw new Error("permission-denied");
    }

    const { token } = auth;

    console.log(`token: ${JSON.stringify(token)}`);

    return handler(data);
  });
};

const getTimeStamp = () => FieldValue.serverTimestamp();

export { onAdminCall, onCall, onRequest, getTimeStamp };
