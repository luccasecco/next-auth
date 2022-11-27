import { createContext, ReactNode, useEffect, useState } from "react";
import Router from 'next/router'
import { api } from "../services/api";
import { setCookie, parseCookies } from 'nookies'

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

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
  user: User | undefined
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProdiverProps) {
  const [user, setUser]= useState<User>()
  const isAuthenticated = !!user

  useEffect(()=> {
    const { 'nextauth.token': token } = parseCookies()

    if(token){
      api.get('/me').then(response => {
        const responseData = response.data
        setUser(responseData)
      })
    }
  }, [])

  async function signIn({email, password}: SignInCredentials){
    try{
      const response  = await api.post('sessions', {
        email,
        password
      })

      const { token, refreshToken, permissions, roles } = response.data

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
  
      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    }catch(err) {
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
      {children}
    </AuthContext.Provider>
  )
}