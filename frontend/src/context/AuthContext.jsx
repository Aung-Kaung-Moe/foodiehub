import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGetMe, apiLogout } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await apiGetMe(); // returns null if not logged
        setUser(me);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const onLogin = (u) => setUser(u);
  const onLogout = async () => {
    try { await apiLogout(); } finally { setUser(null); }
  };

  return (
    <AuthCtx.Provider value={{ user, ready, onLogin, onLogout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
