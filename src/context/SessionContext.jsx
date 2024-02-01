import React, { useEffect, useState, createContext } from "react";

import { me } from "../helpers/me";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(localStorage.getItem("session"));
  const [verifySession, setVerifySession] = useState(false);
  useEffect(() => {
    me()
      .then((response) => {
        if (response.status === 200) {
          setSession(response.data);
        }
      })
      .finally(() => setVerifySession(true));
  }, []);
  return (
    <SessionContext.Provider value={{ session, setSession, verifySession }}>
      {children}
    </SessionContext.Provider>
  );
};
