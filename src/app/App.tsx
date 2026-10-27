import { RouterProvider } from "react-router-dom";
import { appRouter } from "@/app/router";
import { AppProviders } from "@/app/providers/AppProviders";
import { isFirebaseConfigured } from "@/lib/firebase/firebaseConfig";
import { FirebaseConfigRequiredPage } from "@/pages/FirebaseConfigRequiredPage";

export function App() {
  if (!isFirebaseConfigured()) {
    return <FirebaseConfigRequiredPage />;
  }

  return (
    <AppProviders>
      <RouterProvider router={appRouter} />
    </AppProviders>
  );
}
