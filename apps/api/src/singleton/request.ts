import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

const onRequest = functions.https.onRequest;
const onCall = functions.https.onCall;

const getTimeStamp = () => FieldValue.serverTimestamp();

export { onCall, onRequest, getTimeStamp };
