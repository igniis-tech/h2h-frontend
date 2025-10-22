// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }){
//   const [token, setToken] = useState(() => localStorage.getItem('jwt') || null)
//   const [profile, setProfile] = useState(null)

//   useEffect(()=>{
//     if(token){
//       localStorage.setItem('jwt', token)
//     }else{
//       localStorage.removeItem('jwt')
//     }
//   },[token])

//   const logout = () => {
//     setToken(null)
//     setProfile(null)
//   }

//   const value = useMemo(()=>({ token, setToken, profile, setProfile, logout }),[token, profile])
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth(){ return useContext(AuthContext) }
// src/state/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // hydrate from either storage
  const initialToken =
    sessionStorage.getItem('jwt') || localStorage.getItem('jwt') || null;

  const initialProfile = (() => {
    try {
      const s = sessionStorage.getItem('profile') || localStorage.getItem('profile');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const [token, setToken] = useState(initialToken);
  const [profile, setProfile] = useState(initialProfile);

  // Keep both storages in sync with current token
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('jwt', token);
      localStorage.setItem('jwt', token);
    } else {
      sessionStorage.removeItem('jwt');
      localStorage.removeItem('jwt');
    }
  }, [token]);

  // Keep both storages in sync with current profile
  useEffect(() => {
    if (profile) {
      const s = JSON.stringify(profile);
      sessionStorage.setItem('profile', s);
      localStorage.setItem('profile', s);
    } else {
      sessionStorage.removeItem('profile');
      localStorage.removeItem('profile');
    }
  }, [profile]);

  const logout = () => {
    setToken(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ token, setToken, profile, setProfile, logout }),
    [token, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
