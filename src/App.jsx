import React, { useContext } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import "./index.css";
import Dashboard from "./pages/Dashboard"
import { SessionContext } from "./context/SessionContext"
import ProtectedRoutes from "./components/ProtectedRoutes"
import Home from "./pages/Home"
import { LOGIN_ROUTE, DASHBOARD_INDEX_ROUTE, DASHBOARD_ROUTE, USERS_ROUTE, REPORTS_ROUTE, REPORTS_DUPLICATE_ROUTE, STORES_ROUTE, BANKS_ROUTE } from "./consts/Routes";
import Reports, { ReportsIndex } from "./pages/Reports";
import DuplicateReports from "./pages/DuplicateReports";
import Users from "./pages/Users";
import Stores from "./pages/Stores";
import Banks from "./pages/Banks";

function App() {
  const {session, verifySession} = useContext(SessionContext);
  
  return (
    verifySession
    ?
    <React.Fragment>
      <Routes>
        <Route path="/" element={ <ProtectedRoutes isAllowed={!session} redirectTo={`/${DASHBOARD_ROUTE}`}>
            <Login />
          </ProtectedRoutes> } />
        <Route path={`/${LOGIN_ROUTE}`} element={ 
          <ProtectedRoutes isAllowed={!session} redirectTo={`/${DASHBOARD_ROUTE}`}>
            <Login />
          </ProtectedRoutes>
         } />
         <Route element={<ProtectedRoutes isAllowed={ !!session} redirectTo={`/${LOGIN_ROUTE}`} />}>
          <Route path={`/${DASHBOARD_ROUTE}`} element={ <Dashboard />}>
            <Route index element={ <Navigate to={`${DASHBOARD_INDEX_ROUTE}`}/> }  />
            <Route path={`${DASHBOARD_INDEX_ROUTE}`} element={ <Home/> } />
            <Route path={`${REPORTS_ROUTE}`} element={<Reports />}>
              <Route index element={<ReportsIndex/>}/>
              <Route path={`${REPORTS_DUPLICATE_ROUTE}`} element={<DuplicateReports/>}/>
            </Route>
            <Route path={`${STORES_ROUTE}`} element={<Stores/>}/>
            <Route path={`${BANKS_ROUTE}`} element={<Banks/>}/>
            <Route path={`${USERS_ROUTE}`} element={<Users/>}/>
          </Route>
         </Route>
      </Routes>
    </React.Fragment>
    :null
  )
}

export default App
