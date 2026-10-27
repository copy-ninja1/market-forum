import { useContext } from "react";
import type { AuthContextValue } from "@/features/auth/types/auth.interfaces";
import { AuthContext } from "@/features/auth/context/authContext";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
