import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('usertoken'); 

  return token ? children : <Navigate to="/registration" />;
}

export default PrivateRoute;