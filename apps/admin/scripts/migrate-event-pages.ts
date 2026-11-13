import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { normalizeFirebasePrivateKey } from "@c3/config";
import {
  applyEventPageMigration,
  assertMigrationBackup,
  buildMigrationBackup,
  formatMigrationPlan,
  parseApprovedPages,
  parseMigrationArgs,
  planEventPageMigration,
  readMigrationSnapshot,
  revertEventPageMigration,
  snapshotFromExport,
  type MigrationSnapshot,
} from "../lib/event-page-migration";
import { triggerSiteRevalidation } from "../lib/revalidate-site";

/**
 * Migración revisable de fichas por edición (spec 2026-11-13, §9; ruling R28).
 *
 *   ENSAYO (por defecto, no escribe):
 *     pnpm --filter @c3/admin migrate:event-pages --approved aprobadas.json
 *     pnpm --filter @c3/admin migrate:event-pages --approved aprobadas.json --from-file export.json   (sin Firestore)
 *
 *   APLICAR (escribe; solo tras revisar el ensayo y con autorización del responsable):
 *     pnpm --filter @c3/admin migrate:event-pages --apply --approved aprobadas.json --backup copia.event-pages-backup.json
 *
 *   REVERTIR con el respaldo (escribe):
 *     pnpm --filter @c3/admin migrate:event-pages --apply --revert copia.event-pages-backup.json
 *
 * `aprobadas.json` es una lista de { eventId, page } aprobada por el responsable. Las ediciones ambiguas no se
 * deciden aquí: cualquier conflicto bloquea el lote completo. El respaldo contiene documentos completos: tiene el
 * sufijo .event-pages-backup.json (ignorado por git), se crea con permisos 0600 y no se sobrescribe.
 * Sin --apply este script solo lee.
 */

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function readServiceAccount(): ServiceAccount {
  for (const filePath of [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "..", ".env.local"),
    path.resolve(__dirname, "..", ".env"),
  ]) {
    loadEnvFile(filePath);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY.");
  }
  return { projectId, clientEmail, privateKey: normalizeFirebasePrivateKey(privateKey) };
}

function connect() {
  const serviceAccount = readServiceAccount();
  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.projectId });
  }
  return { db: getFirestore(), projectId: serviceAccount.projectId };
}

function readJson(filePath: string, label: string): unknown {
  try {
    return JSON.parse(readFileSync(path.resolve(filePath), "utf8"));
  } catch (error) {
    throw new Error(`No se pudo leer ${label} (${filePath}): ${error instanceof Error ? error.message : String(error)}`);
  }
}

function printPlan(snapshot: MigrationSnapshot, approvedPath: string, now: string) {
  const parsed = parseApprovedPages(readJson(approvedPath, "el archivo de aprobaciones"));
  if (!parsed.ok) {
    for (const error of parsed.errors) {
      console.error(`  ! ${error}`);
    }
    throw new Error("El archivo de aprobaciones no es válido.");
  }

  const plan = planEventPageMigration(snapshot.events, parsed.approved, {
    now,
    reservations: snapshot.reservations,
    unreadablePages: snapshot.unreadablePages,
    unreadableEvents: snapshot.unreadableEvents,
  });
  for (const line of formatMigrationPlan(plan)) {
    console.log(line);
  }
  return plan;
}

async function revalidate(reason: string) {
  const revalidation = await triggerSiteRevalidation({ reason, source: "admin/scripts/migrate-event-pages" });
  if (!revalidation.ok) {
    console.warn("La revalidación del sitio falló; el sitio se refresca solo en poco más de un minuto:", revalidation.message);
  }
}

async function main() {
  const parsed = parseMigrationArgs(process.argv.slice(2));
  if (!parsed.ok) {
    for (const error of parsed.errors) {
      console.error(`  ! ${error}`);
    }
    console.error("Uso: ver el comentario al inicio de scripts/migrate-event-pages.ts. Sin --apply solo se ensaya.");
    process.exitCode = 1;
    return;
  }

  const { options } = parsed;
  const now = new Date().toISOString();

  if (options.mode === "dry-run") {
    const snapshot = options.fromFile
      ? snapshotFromExport(readJson(options.fromFile, "el export local"), { now })
      : await readMigrationSnapshot(connect().db, { now });
    const plan = printPlan(snapshot, options.approvedPath, now);
    console.log("ENSAYO: no se escribió nada.");
    process.exitCode = plan.conflicts.length ? 2 : 0;
    return;
  }

  if (options.mode === "revert") {
    const backup = assertMigrationBackup(readJson(options.revertPath, "el respaldo"));
    const { db, projectId } = connect();
    console.log(`Revirtiendo ${backup.entries.length} evento(s) en el proyecto «${projectId}» con el respaldo del ${backup.createdAt}.`);
    await revertEventPageMigration(db, backup);
    await revalidate("Reverted event page migration");
    console.log("Reversión aplicada: documentos originales restaurados y reservas creadas por la migración eliminadas.");
    return;
  }

  // Aplicar: mismo plan que el ensayo, recalculado sobre los datos de ahora.
  const { db, projectId } = connect();
  const snapshot = await readMigrationSnapshot(db, { now });
  const plan = printPlan(snapshot, options.approvedPath, now);
  if (plan.conflicts.length) {
    console.error("No se aplicó nada: resuelve los conflictos y vuelve a ensayar.");
    process.exitCode = 2;
    return;
  }
  if (!plan.changes.length) {
    return;
  }

  // El respaldo se escribe y se confirma ANTES de tocar Firestore. 'wx': nunca sobrescribe uno existente.
  const backup = buildMigrationBackup(plan.changes, snapshot, now);
  const backupFile = path.resolve(options.backupPath);
  writeFileSync(backupFile, `${JSON.stringify(backup, null, 2)}\n`, { flag: "wx", mode: 0o600 });
  console.log(`Respaldo guardado en ${backupFile} (no lo subas a git; contiene documentos completos).`);

  console.log(`Aplicando ${plan.changes.length} cambio(s) en el proyecto «${projectId}»...`);
  await applyEventPageMigration(db, backup);
  await revalidate("Applied event page migration");
  console.log("Migración aplicada. Para deshacerla: --apply --revert <respaldo>.");
}

main().catch((error) => {
  console.error("Migración fallida:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
