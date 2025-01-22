"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// PrivateRoute component to protect the dashboard route
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/"); // Redirect to homepage if not authenticated
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? children : null; // Render the children only if authenticated
};

export default PrivateRoute;
