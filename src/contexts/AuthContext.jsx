import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (user) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              avatar_url: user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString()
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
      console.error('Error handling user profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user profile",
      });
      setCurrentUser(user);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          ...userData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update auth metadata if name is changed
     // if (userData.full_name) {
      //  const { error: updateError } = await supabase.auth.updateUser({
      //    data: { full_name: userData.full_name }
     //   });
     //   if (updateError) throw updateError;
     // } 

      setCurrentUser(prev => ({
        ...prev,
        ...data,
        user_metadata: {
          ...prev.user_metadata,
          full_name: userData.full_name || prev.user_metadata?.full_name
        }
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
      throw error;
    }
  };

  async function signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecting to Google...",
        description: "Please complete the sign in process.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing in with Google",
        description: error.message,
      });
      throw error;
    }
  }

  async function signup(email, password, name) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification.",
      });

      return authData;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message,
      });
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await fetchUserProfile(data.user);

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
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

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setCurrentUser(null);

      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      });
      throw error;
    }
  }

  const isAdmin = () => {
    return currentUser?.is_admin === true;
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile, // <-- This is the only profile updater you need
    signInWithGoogle,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
