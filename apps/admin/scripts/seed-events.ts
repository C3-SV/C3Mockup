import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultEvents, toFirestoreEventDocument } from "@c3/config";

const EVENTS_COLLECTION = "events";

function readServiceAccount(): ServiceAccount {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY.",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

async function main() {
  const serviceAccount = readServiceAccount();

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });
  }

  const db = getFirestore();
  const now = new Date().toISOString();
  const batch = db.batch();

  for (const event of defaultEvents) {
    const record = {
      ...toFirestoreEventDocument(event),
      createdAt: now,
      updatedAt: now,
    };

    batch.set(db.collection(EVENTS_COLLECTION).doc(record.id), record, { merge: false });
  }

  await batch.commit();
  console.log(`Seeded ${defaultEvents.length} events into Firestore collection "${EVENTS_COLLECTION}".`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
