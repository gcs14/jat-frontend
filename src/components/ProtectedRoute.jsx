import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  if (!token) {
    window.location.href = "https://purple-field-0594e540f.2.azurestaticapps.net/login";
    return null;
  }

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      window.location.href = "https://purple-field-0594e540f.2.azurestaticapps.net/login";
      return null;
    }
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "https://purple-field-0594e540f.2.azurestaticapps.net/login";
    return null;
  }

  return children;
};

export default ProtectedRoute;
