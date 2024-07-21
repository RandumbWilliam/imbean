import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  authUser: any; // replace `any` with your user type
  setAuthUser: React.Dispatch<React.SetStateAction<any>>; // replace `any` with your user type
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authUser, setAuthUser] = useState<any>( // replace `any` with your user type
    JSON.parse(localStorage.getItem("chat-user") || "null"),
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
