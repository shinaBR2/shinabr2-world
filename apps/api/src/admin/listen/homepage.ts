import { onRequest } from "../../singleton";
import { dbBatchWrite, dbGetRef, dbRead } from "../../singleton/db";

const getHomepageFeelings = onRequest(async (req, res) => {
  const snapshot = (await dbRead(
    "homeConfigs/listen/audioList/4dT7fPUVHEJvLZ86Hfzj"
  )) as FirebaseFirestore.DocumentSnapshot;

  res.json(snapshot.data());
});

const saveHomepageFeelings = onRequest(async (req, res) => {
  const { start, end } = dbBatchWrite();
  const batch = start();

  // Set the value of 'NYC'
  const nycRef = dbGetRef("cities/NYC") as FirebaseFirestore.DocumentReference;
  batch.set(nycRef, { name: "New York City" });

  // Update the population of 'SF'
  const sfRef = dbGetRef("cities/SF") as FirebaseFirestore.DocumentReference;
  batch.update(sfRef, { population: 1000000 });

  // Delete the city 'LA'
  const laRef = dbGetRef("cities/LA") as FirebaseFirestore.DocumentReference;
  batch.delete(laRef);

  // Commit the batch
  await end(batch);

  res.send("Success");
});

export { getHomepageFeelings, saveHomepageFeelings };
