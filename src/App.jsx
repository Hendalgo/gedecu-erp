import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import './index.css'
import Dashboard from './pages/Dashboard'
import { SessionContext } from './context/SessionContext'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './pages/Home'
import { LOGIN_ROUTE, DASHBOARD_INDEX_ROUTE, DASHBOARD_ROUTE, USERS_ROUTE, REPORTS_ROUTE, REPORTS_DUPLICATE_ROUTE, STORES_ROUTE, BANKS_ROUTE, REPORTS_MISS_ROUTE, BANK_ACCOUNTS_ROUTE, COUNTRIES_ROUTE, REPORTS_TYPE_ROUTE, CURRENCIES_ROUTE } from './consts/Routes'
import Reports, { ReportsIndex } from './pages/Reports'
import DuplicateReports from './pages/DuplicateReports'
import Users from './pages/Users'
import Stores from './pages/Stores'
import Banks, { BanksIndex } from './pages/Banks'
import Inconsistences from './pages/Inconsistences'
import BankAccounts from './pages/BankAccounts'
import Countries, { CountriesIndex } from './pages/Countries'
import ReportTypes from './pages/ReportTypes'
import Currencies from './pages/Currencies'
import ReportForm from './pages/ReportForm'
import ReportsByUser from './pages/ReportsByUser'
import ReportDetail from './pages/ReportDetail'
import DuplicateReportForm from './pages/DuplicateReportForm'
import Depositors from './pages/Depositors'
import StoreDetail from './pages/StoreDetail'

function App () {
  const { session, verifySession } = useContext(SessionContext)

  return (
    verifySession
      ? <>
        <Routes>
          <Route
            path='/' element={<ProtectedRoutes isAllowed={!session} redirectTo={`/${DASHBOARD_ROUTE}`}>
              <Login />
            </ProtectedRoutes>}
          />
          <Route
            path={`/${LOGIN_ROUTE}`} element={
              <ProtectedRoutes isAllowed={!session} redirectTo={`/${DASHBOARD_ROUTE}`}>
                <Login />
              </ProtectedRoutes>
         }
          />
          <Route element={<ProtectedRoutes isAllowed={!!session} redirectTo={`/${LOGIN_ROUTE}`} />}>
            <Route path={`/${DASHBOARD_ROUTE}`} element={<Dashboard />}>
              <Route index element={<Navigate to={`${DASHBOARD_INDEX_ROUTE}`} />} />
              <Route path={`${DASHBOARD_INDEX_ROUTE}`} element={<Home />} />
              <Route path={`${REPORTS_ROUTE}`} element={<Reports />}>
                <Route index element={<ReportsIndex />} />
                <Route path={`create`} element={<ReportForm />} />
                <Route path={`:id`} element={<ReportDetail />} />
                <Route path={`${REPORTS_DUPLICATE_ROUTE}`} element={<DuplicateReports />} />
                <Route path={`${REPORTS_DUPLICATE_ROUTE}/:id`} element={<DuplicateReportForm />} />
                <Route path={`${REPORTS_MISS_ROUTE}`} element={<Inconsistences />} />
                <Route path={`${REPORTS_TYPE_ROUTE}`} element={<ReportTypes />} />
              </Route>
              <Route path={`${STORES_ROUTE}`} >
                <Route index element={<Stores />} />
                <Route path={`:id`} element={<StoreDetail />} />
              </Route>
              <Route path={`${BANKS_ROUTE}`} element={<Banks/>}>
                <Route index element={<BanksIndex/>}/>
                <Route path={`${BANK_ACCOUNTS_ROUTE}`} element={<BankAccounts/>}/>
              </Route>
              <Route path={`${USERS_ROUTE}`}>
                <Route index element={<Users />} />
                <Route path=":id/reports" element={<ReportsByUser />} />
                <Route path="depositors" element={<Depositors />} />
              </Route>
              <Route path={`${COUNTRIES_ROUTE}`} element={<Countries/>} >
                <Route index element={<CountriesIndex />} />
                <Route path={`${CURRENCIES_ROUTE}`} element={<Currencies />}/>
              </Route>
            </Route>
          </Route>
        </Routes>
        </>
      : null
  )
}

export default App
