import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Create context
const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const inactivityTimeout = useRef();

  // Auto-logout after 30min inactivity
  useEffect(() => {
    function resetInactivityTimer() {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        toast({
          title: "Logged out due to inactivity",
          description: "Please log in again to continue.",
        });
        window.location.reload();
      }, 30 * 60 * 1000); // 30 minutes
    }
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    resetInactivityTimer();
    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
    // eslint-disable-next-line
  }, []);

  // Session restore and listener
  useEffect(() => {
  
    supabase.auth.getSession().then(async ({ data, error }) => {
      // data is an object: { session }
      console.log("Session result:", data?.session, error);

      if (error) {
        console.error("Error getting session:", error);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const session = data?.session;

      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Listen for login/logout/refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state change event:", _event, session);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  // Fetch/create user profile in "profiles" table
  const fetchUserProfile = async (user) => {
    try {
      console.log("Fetching profile for user:", user.id);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        // If no profile, create one
        if (error.code === "PGRST116") {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{
              id: user.id,
              full_name: user.user_metadata?.full_name || "",
              avatar_url: user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
            }])
            .select()
            .single();
          if (createError) throw createError;
          setCurrentUser({ ...user, ...newProfile });
          return;
        }
        throw error;
      }
      setCurrentUser({ ...user, ...profile });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        variant: "destructive",
        title: "Profile error",
        description: "Could not fetch your user profile.",
      });
      setCurrentUser(user);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: currentUser.id,
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentUser((prev) => ({
        ...prev,
        ...data,
        user_metadata: {
          ...prev.user_metadata,
          full_name: userData.full_name || prev.user_metadata?.full_name,
        },
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message,
      });
      throw error;
    }
  };

  // Google sign-in
  async function signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      toast({
        title: "Redirecting...",
        description: "Continue with your Google account.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google sign-in error",
        description: error.message,
      });
      throw error;
    }
  }

  // Email signup
  async function signup(email, password, name) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (authError) throw authError;
      toast({
        title: "Account created!",
        description: "Check your email for verification.",
      });
      return authData;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
      throw error;
    }
  }

  // Email login
  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await fetchUserProfile(data.user);
      toast({
        title: "Welcome!",
        description: "You are now logged in.",
      });
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      throw error;
    }
  }

  // Logout
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "See you next time.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout error",
        description: error.message,
      });
      throw error;
    }
  }

  const isAdmin = () => currentUser?.is_admin === true;

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    signInWithGoogle,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span>Loading...</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
