import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null)
  const [profile, setProfile] = useState(null)

  useEffect(()=>{
    if(token){
      localStorage.setItem('jwt', token)
    }else{
      localStorage.removeItem('jwt')
    }
  },[token])

  const logout = () => {
    setToken(null)
    setProfile(null)
  }

  const value = useMemo(()=>({ token, setToken, profile, setProfile, logout }),[token, profile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){ return useContext(AuthContext) }
