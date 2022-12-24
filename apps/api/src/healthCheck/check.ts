import db, { getTimeStamp, onRequest } from "../singleton";

const checkRead = onRequest(async (req, res) => {
  const snapshot = await db.collection("feelings").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });

  res.send("Success");
});

const checkWrite = onRequest(async (req, res) => {
  const ref = db.collection("tmp").doc("checkWrite");

  await ref.update({
    healCheck: true,
    timestamp: getTimeStamp(),
  });

  res.send("Success");
});

export { checkRead, checkWrite };
