import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user/profile", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
