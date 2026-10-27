import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";

type FirebaseWebConfig = {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
};

function readConfig(): FirebaseWebConfig {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      "Missing Firebase web configuration. Copy .env.example to .env.local and fill in VITE_FIREBASE_* values.",
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let emulatorsConnected = false;

function shouldUseEmulators(): boolean {
  return import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";
}

function connectEmulators(authInstance: Auth, db: Firestore, storageInstance: FirebaseStorage): void {
  if (emulatorsConnected || !shouldUseEmulators()) {
    return;
  }

  const authHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
  const firestoreHost = import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  const storageHost = import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_HOST || "127.0.0.1:9199";

  connectAuthEmulator(authInstance, `http://${authHost}`, { disableWarnings: true });

  const [firestoreHostname, firestorePort] = firestoreHost.split(":");
  connectFirestoreEmulator(db, firestoreHostname || "127.0.0.1", Number(firestorePort || 8080));

  const [storageHostname, storagePort] = storageHost.split(":");
  connectStorageEmulator(storageInstance, storageHostname || "127.0.0.1", Number(storagePort || 9199));

  emulatorsConnected = true;
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(readConfig());
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
    connectEmulators(auth, getFirebaseFirestore(), getFirebaseStorage());
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}
