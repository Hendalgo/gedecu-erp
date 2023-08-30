import { Navigate, Outlet } from 'react-router-dom'
import { LOGIN_ROUTE } from '../../consts/Routes'

const ProtectedRoutes = ({isAllowed, children, redirectTo=`/${LOGIN_ROUTE}`}) => {
  
  if (!isAllowed) {
    return <Navigate to={redirectTo}/>
  }
  return children ? children : <Outlet />
}

export default ProtectedRoutes;