import { createContext, ReactNode, useContext, useState } from "react";

import { AuthObject } from "@/types";

interface AuthContextType {
  auth: AuthObject | null;
  setAuth: (auth: AuthObject | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthObject | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
}
