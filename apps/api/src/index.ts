import * as functions from "firebase-functions";
/* import { createServer } from "./server";
import { log } from "logger"; */

// eslint-disable-next-line turbo/no-undeclared-env-vars
/* const port = process.env.PORT || 5001;
const server = createServer();

server.listen(port, () => {
  log(`api running on ${port}`);
}); */

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

const hello = functions.https.onRequest(async (req, res) => {
  const snapshot = await db.collection("feelings").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });

  res.send("Firebase Cloud Functions");
});

export { hello };
