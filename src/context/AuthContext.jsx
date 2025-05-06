import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase/supabase-client";
import { getUserRole } from "../../supabase/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced user state setter that includes role information
  const enhancedSetUser = async (authUser) => {
    if (!authUser) {
      console.log("[AuthContext] Setting user to null (logout)");
      setUser(null);
      return;
    }

    try {
      console.log("[AuthContext] Getting role for user:", authUser.id);
      // Get the user's role and profile data
      const { role, profile, error } = await getUserRole();

      if (error) {
        console.error("[AuthContext] Error getting user role:", error);
        // Still set the basic user info even if role lookup fails
        setUser({
          ...authUser,
          role: null,
          roleError: error,
        });
        return;
      }

      if (role) {
        console.log("[AuthContext] User role found:", role);
        setUser({
          ...authUser,
          role,
          profile,
        });
      } else {
        console.log("[AuthContext] No role found for user:", authUser.id);
        setUser({
          ...authUser,
          role: null,
        });
      }
    } catch (err) {
      console.error("[AuthContext] Error enhancing user with role:", err);
      setUser(authUser); // Fall back to basic user info
    }
  };

  // Provide both the regular setter and the enhanced setter
  const value = useMemo(
    () => ({
      user,
      setUser: enhancedSetUser,
      setUserDirect: setUser, // Direct setter for cases where role isn't needed
      loading,
    }),
    [user, loading]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // Check for session on load
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("[AuthContext] Session found on load for user:", session.user.id);
          await enhancedSetUser(session.user);
        } else {
          console.log("[AuthContext] No session found on load");
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] Error initializing auth:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Auth state change event:", event);

      if (event === "SIGNED_IN" && session?.user) {
        console.log("[AuthContext] User signed in:", session.user.id);
        await enhancedSetUser(session.user);
      } else if (event === "SIGNED_OUT") {
        console.log("[AuthContext] User signed out");
        setUser(null);
      } else if (event === "USER_UPDATED" && session?.user) {
        console.log("[AuthContext] User updated:", session.user.id);
        await enhancedSetUser(session.user);
      }
    });

    return () => {
      if (authListener?.subscription) {
        console.log("[AuthContext] Unsubscribing from auth listener");
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
