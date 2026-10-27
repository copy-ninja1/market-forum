import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminRoute } from "@/app/AdminRoute";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { ProtectedRoute } from "@/app/ProtectedRoute";
import { ROUTES } from "@/constants/route.constants";
import { AdminCategoriesPage, ModerationQueuePage } from "@/features/admin";
import {
  PasswordResetPage,
  SignInPage,
  SignUpPage,
} from "@/features/auth";
import {
  BrowseListingsPage,
  CreateListingPage,
  EditListingPage,
  ListingDetailsPage,
  MyListingsPage,
} from "@/features/listings";
import { ProfilePage } from "@/features/profiles/pages/ProfilePage";
import { ForbiddenPage } from "@/pages/ForbiddenPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "browse", element: <BrowseListingsPage /> },
      { path: "forbidden", element: <ForbiddenPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "listings/new", element: <CreateListingPage /> },
          { path: "listings/:listingId/edit", element: <EditListingPage /> },
          { path: "my-listings", element: <MyListingsPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
      { path: "listings/:listingId", element: <ListingDetailsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.signIn} replace /> },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      { path: "password-reset", element: <PasswordResetPage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin/reports", element: <ModerationQueuePage /> },
          { path: "/admin/categories", element: <AdminCategoriesPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
