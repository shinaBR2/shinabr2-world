import { logger, onRequest } from "./singleton";
// import { getApp } from "firebase/app";
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "localhost", 5001);

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
