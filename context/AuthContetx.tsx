import { createContext, ReactNode } from "react";

type SignInCredentials = {
  email: string,
  password: string
}

type AuthProdiverProps = {
  children: ReactNode
}

type AuthContextData ={
  signIn(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProdiverProps) {
  const isAuthenticated = false

  async function signIn({email, password}: SignInCredentials){
    console.log(email, password)
  }

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  )
}