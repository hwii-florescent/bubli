// ProtectedRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../App"; // Adjust the path if necessary
import { Navigate } from "react-router-dom";

const ProtectedNavBar = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default ProtectedNavBar;
