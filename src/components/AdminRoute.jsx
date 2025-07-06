
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      // Fetch is_admin from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", currentUser.id)
        .single();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(data.is_admin === true);
      }
    };

    checkAdmin();
  }, [currentUser]);

  if (isAdmin === null) {
    // Loading state
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Checking admin access...</div>
      </div>
    );
  }

  // Not admin? Redirect!
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Is admin, show children
  return children;
};

export default AdminRoute;
