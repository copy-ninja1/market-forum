# Student Market Forum

A Firebase-powered campus marketplace where students browse listings, publish items, contact sellers, and report suspicious posts. Administrators moderate reports through a protected queue.

## Features

- Browse, search, filter, and sort public listings
- Email/password authentication with branded email verification and password-reset completion
- Profile management
- Create, edit, mark sold/unavailable, and delete owned listings
- Image uploads to Firebase Storage with client validation
- Listing reports and administrator moderation
- Firestore and Storage security rules with emulator tests
- Installable Progressive Web App (service worker + web app manifest)
- SSR + SEO for public pages (meta, Open Graph, JSON-LD, sitemap, robots.txt)

## Stack

- React 19 + TypeScript + Vite
- HeroUI React v3 + Tailwind CSS v4
- React Router
- vite-plugin-pwa (Workbox)
- Firebase Authentication, Firestore, Storage, Hosting, Cloud Functions (SSR + sitemap)
- Vitest + React Testing Library + Firebase Emulator Suite

## Quick start

```bash
pnpm install
pnpm --dir functions install
cp .env.example .env.local
# Fill VITE_FIREBASE_* and VITE_PUBLIC_SITE_URL from your Firebase web app config
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
| `pnpm build` | Typecheck, web build, SSR shell copy, and functions bundle |
| `pnpm preview` | Preview production web build |
| `pnpm typecheck` | TypeScript project references check |
| `pnpm lint` | Oxlint over `src` and `functions/src` |
| `pnpm test` | Unit/component tests |
| `pnpm test:security` | Firestore rules tests (requires emulator) |
| `pnpm emulators` | Auth, Firestore, and Storage emulators |
| `pnpm emulators:ssr` | Emulators including Hosting + Functions SSR |
| `pnpm deploy` | Build and deploy Hosting + Functions |
| `pnpm bootstrap:admin` | Assign `admin` custom claim via Admin SDK |
| `pnpm seed:categories` | Seed default listing categories |

## Architecture

Feature-first folders under `src/features/*` keep UI, hooks, services, repositories, schemas, and types separated. Shared UI lives in `src/components`. Firebase SDK setup is centralized in `src/lib/firebase`.

Public pages (`/`, `/browse`, `/listings/:id`) are SSR’d by Cloud Functions: the function injects title/description/canonical/Open Graph/JSON-LD and crawler-visible HTML into the Vite shell before the SPA hydrates. Private account and admin routes stay client-rendered and are `noindex`.

Set `VITE_PUBLIC_SITE_URL` (and `PUBLIC_SITE_URL` on Functions) to your production origin so canonical URLs and the sitemap stay absolute.

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
