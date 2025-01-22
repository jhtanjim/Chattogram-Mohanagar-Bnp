import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [allUserData, setAllUserData] = useState([]);

  const userId = user?.id;
  const userInformation = allUserData?.find((u) => u.userId === userId);

  // Fetch all user data on initialization
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    fetchAllUsers();
  }, []);

  // Function to handle login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Function to fetch all user data
  const fetchAllUsers = () => {
    fetch("https://bnp-api-9oht.onrender.com/user")
      .then((res) => res.json())
      .then((data) => setAllUserData(data.users))
      .catch((error) => console.error("Error fetching user data:", error));
  };

  // Provide the context to children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        userInformation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
