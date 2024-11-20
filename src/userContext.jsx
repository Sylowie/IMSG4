import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userID, setUserID] = useState(null);

  const isTokenValid = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch("http://localhost:3002/auth_jwt/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUserRole(data.user.role);
        setUserID(data.user.id);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }

    setIsAuthenticated(false);
    return false;
  };

  useEffect(() => {
    isTokenValid();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, isAuthenticated, setIsAuthenticated, userID }}>
      {children}
    </UserContext.Provider>
  );
};
