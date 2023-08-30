import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { SessionContext } from '../context/SessionContext'

const Login = () => {
  const {session, setSession} = useContext(SessionContext);
  if (session) {
    return <Navigate to="/dashboard"/>
  }
  return (
    <>
      <button onClick={()=> setSession(true)}>Login</button>
    </>
  )
}

export default Login