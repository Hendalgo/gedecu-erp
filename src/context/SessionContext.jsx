import React, { useEffect, useState } from 'react'
import { createContext } from 'react'

export const SessionContext = createContext();

export const SessionProvider = ({children}) => {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem("session")));
  return (
    <SessionContext.Provider value={{session, setSession}}>
      {children}
    </SessionContext.Provider>
  )
}
