import { existsSync, readFileSync } from "fs";
import path from "path";

import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultEvents, toFirestoreEventDocument } from "@c3/config";
import { triggerSiteRevalidation } from "../lib/revalidate-site";

const EVENTS_COLLECTION = "events";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function loadLocalEnv() {
  const candidates = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "..", ".env.local"),
    path.resolve(__dirname, "..", ".env"),
  ];

  for (const filePath of candidates) {
    loadEnvFile(filePath);
  }
}

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
  loadLocalEnv();

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
  const revalidation = await triggerSiteRevalidation({
    reason: "Seeded default events into Firestore",
    source: "admin/scripts/seed-events",
  });

  if (!revalidation.ok) {
    console.warn("Site revalidation failed after seeding events:", revalidation.message);
  }
  console.log(`Seeded ${defaultEvents.length} events into Firestore collection "${EVENTS_COLLECTION}".`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
