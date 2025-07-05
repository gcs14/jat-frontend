import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "https://purple-field-0594e540f.2.azurestaticapps.net/login";
    return null;
  }

  return children;
};

export default ProtectedRoute;