import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";

initializeApp();

const logger = functions.logger;
const https = functions.https;
const onRequest = https.onRequest;

export { logger, onRequest };
