# Data model

Identifiers use Firebase Auth UIDs and Firestore document IDs. Timestamps are stored as Firestore `Timestamp` values and converted to `Date` in repositories.

## `users/{uid}`

| Field | Type | Notes |
|---|---|---|
| uid | string | Matches Auth UID |
| displayName | string | Public-ish seller label source |
| email | string \| null | Private; not shown on listings by default |
| institution | string | Campus/community label |
| avatarUrl | string \| null | Optional |
| preferredContactType | email \| phone \| other | Profile preference |
| preferredContactValue | string | Profile preference |
| accountStatus | active \| restricted \| disabled | Not user-editable to escalate privileges |
| createdAt / updatedAt | Timestamp | Server timestamps |

Admin privileges are **not** stored here. They use Auth custom claims.

## `listings/{listingId}`

| Field | Type | Notes |
|---|---|---|
| ownerUid | string | Set from authenticated UID |
| ownerDisplayName | string | Snapshot for public display |
| title / description | string | Validated lengths |
| categoryId / categoryName | string | Name denormalized for read convenience |
| price | number | >= 0 |
| currencyCode | string | ISO-like 3-letter code |
| condition | new \| like-new \| good \| fair | |
| locationLabel | string | Campus location text |
| images | array | `{ url, storagePath, altText }` max 5 |
| contactType / contactValue | intentionally public contact | Shown on detail page |
| status | active \| sold \| unavailable \| hidden | Hidden excluded from public browse |
| searchKeywords | string[] | Token/prefix index for MVP search |
| createdAt / updatedAt | Timestamp | |

## `categories/{categoryId}`

| Field | Type |
|---|---|
| name, slug, description | string |
| isActive | boolean |
| sortOrder | number |
| createdAt / updatedAt | Timestamp |

Writes are administrator-only.

## `reports/{reportId}`

| Field | Type |
|---|---|
| listingId | string |
| reporterUid | string |
| reasonCode | misleading \| prohibited \| spam \| safety \| other |
| details | string |
| status | open \| reviewing \| resolved \| dismissed |
| reviewedAt / reviewedByUid | moderation metadata |
| moderationAction | dismiss \| hide \| remove \| none |
| moderationReason | string |
| createdAt | Timestamp |

Reports are readable by the reporter and administrators only.
