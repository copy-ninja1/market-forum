import { APP_NAME } from "@/constants/app.constants";

export function FirebaseConfigRequiredPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16">
      <p className="font-display text-3xl text-campus-ink">{APP_NAME}</p>
      <h1 className="text-2xl font-semibold text-campus-ink">Firebase configuration required</h1>
      <p className="text-campus-ink/80">
        Copy <code className="rounded bg-campus-mist px-1.5 py-0.5">.env.example</code> to{" "}
        <code className="rounded bg-campus-mist px-1.5 py-0.5">.env.local</code>, add your Firebase
        web app values, then restart the development server.
      </p>
      <p className="text-sm text-campus-ink/70">
        See <code className="rounded bg-campus-mist px-1.5 py-0.5">docs/FIREBASE_SETUP.md</code> for
        detailed setup steps.
      </p>
    </main>
  );
}
