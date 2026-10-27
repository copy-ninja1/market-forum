# Student Market Forum

A Firebase-powered campus marketplace where students browse listings, publish items, contact sellers, and report suspicious posts. Administrators moderate reports through a protected queue.

## Features

- Browse, search, filter, and sort public listings
- Email/password authentication with profile management
- Create, edit, mark sold/unavailable, and delete owned listings
- Image uploads to Firebase Storage with client validation
- Listing reports and administrator moderation
- Firestore and Storage security rules with emulator tests

## Stack

- React 19 + TypeScript + Vite
- HeroUI React v3 + Tailwind CSS v4
- React Router
- Firebase Authentication, Firestore, Storage, Hosting
- Vitest + React Testing Library + Firebase Emulator Suite

## Quick start

```bash
pnpm install
cp .env.example .env.local
# Fill VITE_FIREBASE_* values from your Firebase web app config
pnpm dev
```

Optional emulator mode:

```bash
# In .env.local
VITE_USE_FIREBASE_EMULATORS=true
pnpm emulators
pnpm seed:categories
pnpm dev
```

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start Vite development server |
| `pnpm build` | Typecheck and production build |
| `pnpm preview` | Preview production build |
| `pnpm typecheck` | TypeScript project references check |
| `pnpm lint` | Oxlint over `src` |
| `pnpm test` | Unit/component tests |
| `pnpm test:security` | Firestore rules tests (requires emulator) |
| `pnpm emulators` | Auth, Firestore, and Storage emulators |
| `pnpm bootstrap:admin` | Assign `admin` custom claim via Admin SDK |
| `pnpm seed:categories` | Seed default listing categories |

## Architecture

Feature-first folders under `src/features/*` keep UI, hooks, services, repositories, schemas, and types separated. Shared UI lives in `src/components`. Firebase SDK setup is centralized in `src/lib/firebase`.

See:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- [docs/SECURITY.md](docs/SECURITY.md)
- [docs/TESTING.md](docs/TESTING.md)

## Admin bootstrap

Administrator access uses the Firebase Auth custom claim `admin: true`. Never store admin roles in editable user profile documents.

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
pnpm bootstrap:admin --email student.admin@campus.edu
```

## Search limitations

MVP search uses normalized `searchKeywords` and Firestore `array-contains` matching on the first search token. It is prefix/token matching, not arbitrary full-text search.

## License

Private academic/project use unless otherwise stated.
