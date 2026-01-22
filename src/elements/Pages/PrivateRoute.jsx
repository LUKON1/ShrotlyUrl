import { Navigate } from "react-router-dom";
import useAuth from "../../utils/useAuth";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";
function PrivateRoute({ children }) {
  const { auth } = useAuth();
  if (auth?.accessToken) {
    return children;
  }
  return <Navigate to={CLIENT_ROUTES.SIGNIN} />;
}

export default PrivateRoute;
