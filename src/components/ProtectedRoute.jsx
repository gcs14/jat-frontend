import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp;
    if (exp && Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Token decode failed:", error.message);
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
