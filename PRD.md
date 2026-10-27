# Product Requirements Document (PRD)
## Student Market Forum
**Firebase-powered web application | Version 1.0**

## 1. Document Purpose
This PRD defines the product scope, user experience, requirements, data model, security expectations, and acceptance criteria for Student Market Forum. It is based on the supplied project report, *Design and Implementation of Student Market Forum*, and translates its student-focused listing and discovery concept into an implementable Firebase application.

The forum is primarily a marketplace-information platform: students publish and discover goods or services and contact sellers using the contact method provided. Online payments, escrow, delivery, identity verification, and dispute resolution are not part of the MVP unless separately approved and implemented.

## 2. Product Overview
Student Market Forum provides a central, searchable place for members of an academic community to advertise items, browse offers, and manage their own listings. It addresses scattered announcements across word of mouth, notice boards, social media, and messaging groups, where details may be inconsistent or difficult to find.

### 2.1 Product goals
- Centralize student-oriented marketplace listings in a structured interface.
- Make it easy to browse, search, and filter listings on phones, tablets, and desktops.
- Let authenticated users create, edit, mark as sold, and remove their own listings.
- Present useful product details consistently, including price, condition, category, images, and seller contact method.
- Provide basic reporting and administrator moderation to help manage unsuitable or misleading content.
- Use secure, maintainable Firebase services and document how the application is configured, tested, and deployed.

### 2.2 Success measures
- Users can complete the core browse and listing workflows without broken routes or misleading success messages.
- Valid listings are persisted and appear in browse/search results; edits and status changes are reflected consistently.
- Users cannot modify or delete another user's listings through the UI or direct Firebase requests.
- Firestore Security Rules deny unauthorized writes and protect private account data.
- Mobile layouts remain usable at common narrow screen widths and provide loading, empty, error, and success states.
- Testing records actual outcomes for authentication, listing CRUD, search/filtering, image upload, reporting, and moderation.

## 3. Target Users and Roles

### 3.1 Visitor
- Browse active/public listings and view listing details.
- Search and filter listings.
- Be prompted to sign in before creating or managing listings or submitting reports, where required.

### 3.2 Registered student/community member
- Register, sign in, sign out, and manage a basic profile.
- Create listings with structured information and optional images.
- Edit, mark as sold/unavailable, or delete their own listings.
- Use the seller contact method shown on a listing.
- Report a suspicious, misleading, or inappropriate listing.

### 3.3 Administrator/moderator
- Access a protected administration area.
- Review reported listings and report context.
- Remove or hide policy-violating listings and record a moderation reason.
- Manage listing categories and, if included, suspend or restrict accounts.
- Review basic marketplace activity without accessing unnecessary private user data.

Administrator privileges must be assigned through a trusted process, such as Firebase Admin SDK/custom claims from a secured administrative script or server environment. Never allow users to make themselves administrators by editing a profile document.

## 4. Scope

### 4.1 MVP / required
- Responsive public landing/home page and marketplace browse page.
- Email/password authentication using Firebase Authentication; email verification should be supported before higher-trust actions if enabled.
- Profile basics: display name, institution/community field if required, optional avatar, and preferred contact method.
- Create, view, update, mark sold/unavailable, and delete own listings.
- Listing fields: title, description, category, price, currency, item condition, campus/location text, contact method, image(s), status, owner UID, `createdAt`, and `updatedAt`.
- Search by title and relevant searchable fields; category and status filters; sorting by newest and price where supported by the chosen query/index strategy.
- Listing detail page with seller display name and only the contact information the seller chose to expose.
- Report listing workflow and protected admin moderation screen.
- Form validation, loading states, empty states, error handling, confirmation for destructive actions, and responsive navigation.
- Firebase configuration, Firestore and Storage Security Rules, indexes, environment setup, deployment instructions, and test documentation.

### 4.2 Out of scope for MVP
- Online payments, wallet balances, escrow, commissions, refunds, and order settlement.
- Delivery booking/tracking, logistics, and dispute-resolution workflows.
- Guaranteed student identity verification unless an institution-specific verification process is later approved.
- Real-time internal chat, push notifications, ratings/reviews, recommendation algorithms, and advanced analytics.
- Native iOS/Android apps. The initial product is a responsive web application.

## 5. Core User Journeys

### Discover an item
A visitor opens the marketplace, searches by keyword, filters by category, opens a listing, checks price/condition/location, and contacts the seller using the displayed contact method.

### Publish a listing
A member signs in, opens Create Listing, enters required details, optionally uploads images, validates the form, submits, and sees the new listing after Firebase confirms the write.

### Manage a listing
A member opens My Listings, edits a listing they own, marks it sold/unavailable or deletes it after confirmation; public browse results reflect the new state.

### Report a listing
A signed-in member selects Report, chooses a reason, adds optional details, and submits. Duplicate or abusive reports should be limited. The report is visible only to authorized moderators.

### Moderate a report
An administrator opens the moderation queue, reviews the listing and report, takes a permitted action, records a reason, and sees the updated moderation state.

## 6. Functional Requirements
- **FR-01 Authentication:** Users can register, sign in, sign out, and recover access using Firebase Authentication. Errors are clear and do not expose sensitive account details.
- **FR-02 Profile:** A signed-in user can view and update permitted profile fields. The UID is the stable identity key; users cannot change their role or moderation flags.
- **FR-03 Browse listings:** Visitors can browse active listings with pagination or incremental loading. Sold, removed, and hidden listings are excluded from default public results.
- **FR-04 Listing details:** A detail page displays title, description, images, price/currency, condition, category, location, availability, seller display name, and seller-selected contact method.
- **FR-05 Create listing:** Authenticated members can create a listing after client-side validation and Firebase-authorized write checks. The server/database rules must not trust client-provided owner IDs or admin flags.
- **FR-06 Edit/delete own listing:** Only the owner or authorized administrator can edit or remove a listing. Deletion should use a confirmation step and clean up associated images where practical.
- **FR-07 Listing status:** Owners can mark a listing active, sold, or unavailable. Public discovery should filter according to status.
- **FR-08 Search/filter/sort:** Users can search and narrow listings. The implementation must document Firestore query/index limitations and avoid pretending arbitrary full-text search exists if it does not.
- **FR-09 Image upload:** Users can upload allowed image formats within configured size limits. Files are stored in Firebase Storage with paths scoped to the owner/listing and validated access rules.
- **FR-10 Reporting:** Authenticated members can submit a report with a controlled reason and optional note. Report records are not publicly readable.
- **FR-11 Moderation:** Administrators can review reports, hide/remove listings, record actions and reasons, and manage categories if this capability is included.
- **FR-12 Feedback:** Every asynchronous operation shows a loading state and a truthful success or error state. Failed writes must never display success.
- **FR-13 Accessibility/responsiveness:** Core flows work on mobile and desktop, with keyboard-visible focus, labels, semantic headings, readable contrast, and image alt text.
- **FR-14 Auditability:** Important administrative actions record actor UID, action, target listing, reason, and timestamp where practical.

## 7. Data Model (Cloud Firestore)
Use Firestore document IDs and Firebase Auth UIDs as identifiers. Store timestamps as Firestore `Timestamp` values. Keep public listing fields separate from private account data.

### 7.1 `users/{uid}`
Suggested fields: `uid`, `displayName`, `email` (only if needed and not publicly exposed), `institution`, `avatarUrl`, `preferredContactType`, `preferredContactValue` (privacy-aware), `createdAt`, `updatedAt`, and `accountStatus`. Role/privilege claims must be controlled by trusted administrative tooling, not user-editable profile data.

### 7.2 `listings/{listingId}`
Suggested fields: `ownerUid`, `title`, `description`, `categoryId`, `price` (numeric), `currencyCode`, `condition`, `locationLabel`, `imageUrls`, `contactType`, `contactValue` (only if intentionally public), `status` (`active`/`sold`/`unavailable`/`hidden`), optional `searchKeywords` or normalized search fields, `createdAt`, `updatedAt`, and `moderationStatus`. Validate allowed values and lengths.

### 7.3 `categories/{categoryId}`
Suggested fields: `name`, `slug`, `description`, `isActive`, `sortOrder`, `createdAt`, and `updatedAt`. Category writes are administrator-only.

### 7.4 `reports/{reportId}`
Suggested fields: `listingId`, `reporterUid`, `reasonCode`, `details`, `status` (`open`/`reviewing`/`resolved`/`dismissed`), `createdAt`, `reviewedAt`, `reviewedByUid`, `moderationAction`, and `moderationReason`. Only the reporter and authorized moderators should have the minimum access required; reports must not be public.

### 7.5 Optional subcollections
A listing may use a subcollection for moderation events if a full audit trail is needed. Avoid unnecessary duplication and do not store secrets, passwords, payment credentials, or private identity documents in Firestore.

## 8. Firebase Architecture
- **Firebase Authentication:** email/password sign-in and account recovery; optional Google sign-in only if configured and tested.
- **Cloud Firestore:** users, listings, categories, and reports.
- **Firebase Storage:** listing images and optional avatars.
- **Firebase App Check:** enable and enforce for supported production clients after validating the integration.
- **Firebase Hosting:** deploy the web frontend with SPA routing configured.
- **Cloud Functions or a trusted admin-only environment:** use only for privileged server-side operations that cannot safely be done from the client, such as assigning custom claims or performing protected moderation workflows.
- **Firebase Emulator Suite:** local development and automated testing of Auth, Firestore Rules, Storage Rules, and Functions where used.

Choose the frontend framework already present in the repository if one exists. For a new build, use React + TypeScript with a clear feature-based structure. Keep Firebase access in a dedicated service/repository layer and keep UI components free of direct database business logic.

## 9. Non-Functional Requirements
- **Security:** least-privilege Firestore and Storage rules; ownership checks; protected admin access; no secrets in frontend code; no reliance on UI-only authorization.
- **Privacy:** collect minimum data; clearly communicate which contact fields are public; do not expose user email addresses by default.
- **Performance:** paginate or incrementally load results, optimize/compress images, avoid unbounded collection reads, and use required Firestore indexes.
- **Reliability:** show retryable errors where appropriate, prevent duplicate submissions, and maintain consistent status changes.
- **Maintainability:** strict TypeScript, reusable components, typed data models, modular services, clear naming, and DRY implementation.
- **Usability:** mobile-first layouts, consistent navigation, clear validation and feedback, useful empty states, and no dead buttons.
- **Accessibility:** semantic HTML, labels, keyboard navigation, focus states, reasonable contrast, and alternative text.
- **Cost awareness:** avoid broad real-time listeners and unbounded reads; document Firebase billing-sensitive operations and set budget alerts.

## 10. Security and Abuse Prevention
- Write explicit Firestore and Storage Security Rules and test them with the Emulator Suite.
- Only authenticated users can create listings/reports; users may update/delete only their own listings unless authorized as admins.
- Validate types, lengths, price ranges, status transitions, ownership, and allowed fields in rules and trusted backend logic where needed.
- Do not trust client-supplied `ownerUid`, role, moderation status, timestamps, or admin flags.
- Restrict image MIME types and file size; use user/listing-scoped paths and avoid public write access.
- Rate-limit or otherwise mitigate spam/report abuse where feasible; consider App Check and trusted server-side controls.
- Provide a report/moderation policy and clear safety guidance. Do not promise that listings or sellers are verified unless a real verification feature exists.
- Use a safe process to bootstrap the first administrator, and document how to revoke elevated access.

## 11. UX and Visual Direction
- Use a clean, modern campus marketplace visual identity rather than a generic dashboard template.
- Prioritize product photography, readable prices, category chips, clear availability badges, and obvious search.
- The home page should explain the purpose and lead users directly to Browse Listings and Post an Item.
- The create-listing form should be short, grouped, mobile-friendly, and preserve entered values when validation fails.
- Include skeleton/loading states, empty search results, network failure states, permission errors, and confirmation dialogs.
- Use consistent spacing, typography, buttons, form controls, and status labels. Avoid excessive gradients, glassmorphism, decorative cards, and animation that slows core tasks.

## 12. Acceptance Criteria
1. A visitor can browse active listings and open a listing detail page without signing in.
2. A registered user can sign in and publish a valid listing with required fields; invalid or missing fields are rejected with helpful messages.
3. A listing appears in the marketplace only after its Firestore write succeeds.
4. The owner can edit, mark sold/unavailable, and delete their listing; another ordinary user cannot do so, including through direct requests.
5. Search and category/status filters return results consistent with the documented implementation and show a useful no-results state.
6. Image upload rejects unsupported file types and oversized files and follows Storage Rules.
7. A user can submit a report, but ordinary users cannot read all reports or modify moderation decisions.
8. An administrator can access moderation controls; a normal account cannot access them by changing frontend state or profile fields.
9. All key pages work at mobile and desktop widths and have loading, empty, error, and success states.
10. Firestore and Storage rules pass automated tests for allowed and denied access.
11. README covers setup, Firebase project configuration, environment variables, emulator use, deployment, and admin bootstrap.
12. Test documentation records actual observed results, not assumed passes.

## 13. Testing Plan
- **Unit tests:** validation helpers, formatting, status rules, and pure business logic.
- **Component/integration tests:** forms, listing cards, search/filter controls, authentication states, and listing flows.
- **Firebase Emulator tests:** Firestore and Storage allow/deny cases for visitor, owner, other authenticated user, and administrator.
- **End-to-end smoke tests:** register/sign in, browse, create listing, edit listing, mark sold, report listing, and moderation.
- **Manual checks:** mobile layout, keyboard navigation, slow network behavior, empty results, image errors, and logout.
- Record test ID, preconditions, input, expected result, actual result, pass/fail, and defect notes.

## 14. Delivery Plan
1. **Discovery and setup:** inspect repository, confirm framework, create Firebase project/configuration, establish conventions.
2. **Design:** map routes, reusable UI, data model, roles, and security rules before feature implementation.
3. **Foundation:** authentication, app shell, navigation, typed models, Firebase service layer, and error handling.
4. **Marketplace:** browse, detail page, create/edit listing, image upload, ownership checks, status management, search/filter.
5. **Trust and administration:** reporting, moderation queue, admin access setup, and safety guidance.
6. **Quality:** responsive/accessibility pass, emulator rule tests, unit/integration tests, performance/cost review.
7. **Release:** Firebase Hosting deployment, setup documentation, test report, and known limitations.

## 15. Assumptions and Open Decisions
- Initial release is a responsive web application, not a native mobile app.
- Default currency and institution/community are configurable rather than hard-coded throughout the codebase.
- Contact details are exposed only with explicit user choice and clear notice.
- Full-text search is not native to basic Firestore queries; MVP search must use a clearly documented supported strategy or a separately approved search service.
- Admin role assignment is performed by a trusted process, not public registration.
- Payment, delivery, real-time chat, ratings, and identity verification remain future enhancements unless the product owner changes scope.

## 16. Source Alignment Note
The supplied academic report emphasizes organized student listings, browsing, search, listing management, security, moderation, mobile usability, and testing based on observed evidence. Firebase is the implementation choice introduced for this build specification; it is not represented as a technology confirmed by the original report. The final academic write-up must describe only features and test results that are actually implemented.
