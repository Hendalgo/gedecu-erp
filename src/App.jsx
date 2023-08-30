import React, { useContext, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import "./index.css";
import Dashboard from "./pages/Dashboard"
import { SessionContext } from "./context/SessionContext"
import ProtectedRoutes from "./components/ProtectedRoutes"
import Home from "./pages/Home"
import { LOGIN_ROUTE, DASHBOARD_ROUTE, USERS_ROUTE } from "./consts/Routes";

function App() {
  const {session} = useContext(SessionContext);
  
  return (
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
         <Route element={<ProtectedRoutes isAllowed={ !!session}/>}>
          <Route path={`/${DASHBOARD_ROUTE}`} element={ <Dashboard />}>
            <Route index element={ <Home/> }  />
            <Route path={`${USERS_ROUTE}`}/>
          </Route>
         </Route>
      </Routes>
    </React.Fragment>
  )
}

export default App
