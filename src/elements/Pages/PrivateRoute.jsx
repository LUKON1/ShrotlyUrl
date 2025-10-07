import { Navigate } from 'react-router-dom';
import useAuth from '../../utils/useAuth';
function PrivateRoute({ children }) {
  const {auth} = useAuth();
  if (auth?.accessToken) {
    return children;
  }
  return <Navigate to="/signin" />;
}

export default PrivateRoute;