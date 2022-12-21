import * as functions from "firebase-functions";
/* import { createServer } from "./server";
import { log } from "logger"; */

// eslint-disable-next-line turbo/no-undeclared-env-vars
/* const port = process.env.PORT || 5001;
const server = createServer();

server.listen(port, () => {
  log(`api running on ${port}`);
}); */

const hello = functions.https.onRequest((req, res) => {
  res.send("Firebase Cloud Functions");
});

export { hello };
