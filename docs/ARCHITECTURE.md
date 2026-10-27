# Architecture

## Directory layout

```text
src/
  app/                 # bootstrap, router, providers, layouts, route guards
  components/          # shared UI, layout chrome, feedback
  features/
    auth/              # sign-in/up/reset
    listings/          # marketplace CRUD + browse
    categories/        # category reads/admin writes
    profiles/          # account profile
    reports/           # listing reports
    admin/             # moderation queue + category admin UI
  lib/firebase/        # Firebase app/Auth/Firestore/Storage
  seo/                 # page meta, JSON-LD, SSR HTML inject helpers
  pages/               # home, 404, forbidden
  constants/, types/, utils/, hooks/, styles/, test/
functions/
  src/                 # ssrPublic + sitemap Cloud Functions (bundles src/seo)
```

## SSR and SEO

- Client navigations update `<head>` via `react-helmet-async` (`DocumentHead`).
- First HTML for public routes is produced by `ssrPublic`, which loads the Vite shell from `functions/hosting/index.html` and injects meta, canonical, Open Graph, JSON-LD, and `#seo-ssr` crawler markup.
- After hydration, `SeoSsrCleanup` removes `#seo-ssr`.
- Auth, profile, my-listings, and admin pages use `noindex` and are excluded from `robots.txt` / the sitemap.

## Boundaries

| Layer | Responsibility |
|---|---|
| Pages | Route composition and orchestration |
| Components | Presentational UI and local interaction |
| Hooks | React state coordination and subscriptions |
| Services | Business operations + validation orchestration |
| Repositories | Firestore/Storage access and DTO mapping |
| Schemas | Zod validation for untrusted input |
| Types/Interfaces | Domain contracts outside React files |

## Data flow

1. UI collects input and calls a feature hook/service.
2. Service validates with Zod and applies client business rules.
3. Repository writes/reads Firestore or Storage.
4. Security Rules enforce authorization independently of the UI.
5. Privileged admin bootstrap uses the Admin SDK script, not client writes.

## UI conventions

- HeroUI React v3 compound components (`Card.Header`, `TextField` + `Label` + `Input`, `Modal`/`AlertDialog`).
- HeroUI v3 does **not** require a provider; `AppProviders` wraps auth only.
- Buttons use `onPress` for accessibility.
- Loading, empty, error, and success states are required for async flows.

## Path aliases

`@/*` maps to `src/*` via Vite and TypeScript configuration.
