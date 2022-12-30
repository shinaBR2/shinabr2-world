import { dbBatchWrite, dbGetRef } from "../../singleton/db";

interface FeelingInputItem {
  id: string;
  value: any;
}

interface FeelingInputs {
  feelings: FeelingInputItem[];
}

const saveHomepageFeelings = async (data: FeelingInputs) => {
  const { feelings } = data;
  const { start, end } = dbBatchWrite();
  const batch = start();

  /**
   * Steps:
   * - Clear all the current feelings
   * - Push all new feelings
   */
  const path = "/homeConfigs/listen/feelings";
  const ref = dbGetRef(path) as FirebaseFirestore.CollectionReference;
  const allDocs = await ref.listDocuments();

  allDocs.map((doc) => {
    const { id } = doc;

    const docPath = `${path}/${id}`;
    const ref = dbGetRef(docPath) as FirebaseFirestore.DocumentReference;
    batch.delete(ref);
  });

  feelings.map((doc) => {
    const { id, value } = doc;

    const docPath = `${path}/${id}`;
    const ref = dbGetRef(docPath) as FirebaseFirestore.DocumentReference;
    batch.set(ref, value);
  });

  // Commit the batch
  await end(batch);
};

export { saveHomepageFeelings };
