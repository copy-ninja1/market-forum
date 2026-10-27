import { onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "@/features/auth/context/authContext";
import { authService } from "@/features/auth/services/authService";
import type { AuthContextValue, AuthUser, UserProfile } from "@/features/auth/types/auth.interfaces";
import { profileService } from "@/features/profiles/services/profileService";
import { getFirebaseAuth } from "@/lib/firebase/firebaseAuth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const nextProfile = await profileService.getProfile(user.uid);
    setProfile(nextProfile);
  }, [user]);

  const refreshUser = useCallback(async () => {
    const firebaseUser = getFirebaseAuth().currentUser;
    if (!firebaseUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    await firebaseUser.reload();
    const authUser = await authService.mapUser(firebaseUser);
    setUser(authUser);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      void (async () => {
        setIsLoading(true);
        try {
          if (!firebaseUser) {
            setUser(null);
            setProfile(null);
            return;
          }

          const authUser = await authService.mapUser(firebaseUser);
          setUser(authUser);
          const nextProfile = await profileService.ensureProfileExists(authUser);
          setProfile(nextProfile);
        } catch {
          setUser(null);
          setProfile(null);
        } finally {
          setIsLoading(false);
        }
      })();
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: user?.isAdmin ?? false,
      refreshProfile,
      refreshUser,
      signOut,
    }),
    [user, profile, isLoading, refreshProfile, refreshUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
