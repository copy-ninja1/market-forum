# Testing

## Commands

```bash
pnpm test                 # unit + component tests
pnpm test:watch           # watch mode
pnpm typecheck            # TypeScript
pnpm lint                 # Oxlint
pnpm build                # production build
```

## Security rule tests

Requires **JDK 21+** (firebase-tools requirement) and the Firestore emulator.

```bash
firebase emulators:exec --only firestore "pnpm test:security"
```

Or:

```bash
pnpm emulators
# separate terminal
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 pnpm test:security
```

Covered cases include visitor reads, denied visitor creates, owner creates, non-owner update/delete denials, and admin-only report reads.

## Search/filter notes for testers

- Search matches the first normalized token against `searchKeywords`.
- Default browse shows `active` listings.
- Sold/unavailable can be filtered explicitly; `hidden` stays out of public results.

## Observed verification results (2026-10-27)

| Suite | Command | Result | Notes |
|---|---|---|---|
| Unit/component | `pnpm test` | Pass | 6 files, 13 tests |
| Typecheck | `pnpm typecheck` | Pass | |
| Lint | `pnpm lint` | Pass with warnings | Oxlint react set-state-in-effect warnings in data hooks |
| Build | `pnpm build` | Pass | Bundle size warning (~1.3 MB JS); code-splitting optional follow-up |
| Security rules | `pnpm test:security` via emulator | Blocked | Host JDK 18; firebase-tools requires JDK 21+ |
