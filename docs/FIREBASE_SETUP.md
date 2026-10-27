# Firebase setup

## 1. Create a Firebase project

1. Create a project in the Firebase console.
2. Add a Web app and copy the config into `.env.local` using `.env.example` as a template.
3. Enable **Authentication → Email/Password**.
4. Create **Cloud Firestore** (production mode initially; deploy rules immediately).
5. Enable **Storage**.
6. Optionally enable **App Check** for production clients after validating the integration.

## 2. Environment variables

Copy `.env.example` to `.env.local` and set:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Never commit service-account JSON or private keys.

## 3. Deploy rules and indexes

```bash
firebase login
firebase use <project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## 4. Hosting

```bash
pnpm build
firebase deploy --only hosting
```

`firebase.json` rewrites all routes to `index.html` for the SPA.

## 5. Emulators

```bash
pnpm emulators
```

In `.env.local`:

```env
VITE_USE_FIREBASE_EMULATORS=true
```

Seed categories against the emulator with Admin credentials configured for emulator use, or create categories through the admin UI after bootstrapping an admin user.

## 6. Administrator custom claims

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
pnpm bootstrap:admin --email you@campus.edu
```

The user must sign out and back in (or refresh their ID token) before `admin` is visible to the client.
