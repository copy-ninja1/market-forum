# Security

## Principles

- Frontend route guards are UX only. Authorization is enforced by Firestore and Storage rules.
- Clients cannot assign themselves `admin` claims or elevate `accountStatus` into privileged roles.
- Listing `ownerUid` must equal `request.auth.uid` on create.
- Hidden listings are not publicly readable.
- Report documents are not publicly readable.

## Administrator access

Administrators receive Auth custom claim `admin: true` through `scripts/bootstrap-admin.ts` (Firebase Admin SDK).

Revoke access by clearing the claim with the same script/tooling and forcing token refresh.

## Storage

Listing images must live under `listings/{ownerUid}/{listingId}/{fileName}`.

Allowed uploads:

- MIME: `image/jpeg`, `image/png`, `image/webp`
- Max size: 5 MB

## Known limitations

- Firestore cannot provide arbitrary full-text search; MVP keyword indexing is approximate and can be gamed with crafted titles.
- Client-side rate limiting is not a strong abuse control. Prefer App Check, monitoring, and Cloud Functions for production hardening.
- Image cleanup after listing deletion is best-effort from the client/service layer; orphaned files may remain if the client fails mid-operation.
- Email verification is requested on sign-up, but higher-trust gating can be tightened further in rules if required by policy.
