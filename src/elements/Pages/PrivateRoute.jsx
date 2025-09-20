import { Navigate } from 'react-router-dom';
import useAuth from '../../utils/useAuth';
function PrivateRoute({ children }) {
  const {auth} = useAuth();

  return auth?.user ? children : <Navigate to="/registration" />;
}

export default PrivateRoute;