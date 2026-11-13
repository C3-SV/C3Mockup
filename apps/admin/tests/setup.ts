/**
 * Las pruebas del admin nunca hablan con un proyecto real de Firebase (plan eventos-memorias, R3).
 *
 * Se borran las credenciales del entorno: si algún código llamara a getAdminFirestore() durante las pruebas,
 * fallaría en vez de conectarse. La única conexión admitida es el emulador local de Firestore, y solo si apunta a
 * una dirección de loopback (la puerta de integración, además, exige un proyecto «demo-», que Firebase reserva
 * para emuladores).
 */
const credentialVariables = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CONFIG",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "GOOGLE_CLOUD_PROJECT",
  "GCLOUD_PROJECT",
];

for (const name of credentialVariables) {
  delete process.env[name];
}

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
if (emulatorHost && !/^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(emulatorHost)) {
  throw new Error(`FIRESTORE_EMULATOR_HOST debe apuntar a un emulador local, no a «${emulatorHost}».`);
}
