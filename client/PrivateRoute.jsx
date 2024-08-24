import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./src/context/AuthContext";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Add a loading spinner or similar UI
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
