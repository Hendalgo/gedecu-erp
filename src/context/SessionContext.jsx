import React, { useState } from 'react'
import { createContext } from 'react'

export const SessionContext = createContext();

export const SessionProvider = ({children}) => {
  const [session, setSession] = useState({
    name: "Marcos",
    token: "",
    permission: 1,
    permissionTitle: "Administrador"
  });
  return (
    <SessionContext.Provider value={{session, setSession}}>
      {children}
    </SessionContext.Provider>
  )
}
