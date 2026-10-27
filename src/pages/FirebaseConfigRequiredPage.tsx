import { APP_NAME } from "@/constants/app.constants";
import { BrandMark } from "@/components/layout/BrandMark";

export function FirebaseConfigRequiredPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <div className="panel p-8 md:p-10">
        <div className="flex items-center gap-3">
          <BrandMark />
          <p className="font-display text-2xl text-campus-ink">{APP_NAME}</p>
        </div>
        <h1 className="font-display mt-8 text-4xl tracking-tight text-campus-ink">
          Firebase configuration required
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-campus-ink/75">
          Copy <code className="rounded bg-campus-mist px-1.5 py-0.5">.env.example</code> to{" "}
          <code className="rounded bg-campus-mist px-1.5 py-0.5">.env.local</code>, add your Firebase
          web app values, then restart the development server.
        </p>
        <p className="mt-3 text-sm text-campus-ink/65">
          See <code className="rounded bg-campus-mist px-1.5 py-0.5">docs/FIREBASE_SETUP.md</code> for
          the setup steps.
        </p>
      </div>
    </main>
  );
}
