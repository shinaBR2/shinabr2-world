import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";

initializeApp();

const functionsBuilder = functions.region("asia-south1");
const logger = functions.logger;
const https = functionsBuilder.https;
const onRequest = https.onRequest;

export { logger, onRequest };
