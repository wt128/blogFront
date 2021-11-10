import React, { createContext, useContext, useState,useEffect } from "react"
import { useCookies } from "react-cookie"

const AuthUserContext = createContext(false)
const AuthOperationContext = createContext({
  login: () => console.error("Providerが未設定。"),
  logout: () => console.error("Providerが未設定。")
})

const AuthUserProvider = ({children}) =>{

  const [authUser, setAuthUser] = useState(false)
  const [cookie] = useCookies(["sid"])
  useEffect(() => {
    if(cookie.sid){
      setAuthUser(true)
    }
    
  }, [])
  const login = async () => {
    // await login() //ログイン処理
    setAuthUser(true)
  }
  
  const logout = async () => {
    // await login() //ログアウト処理
    setAuthUser(false)
  }

  return (
    <AuthOperationContext.Provider value={{login, logout}}>
      <AuthUserContext.Provider value={authUser}>
        { children }
      </AuthUserContext.Provider>
    </AuthOperationContext.Provider>
  )
}

export const useAuthUser = () => useContext(AuthUserContext)
export const useLogin = () => useContext(AuthOperationContext).login
export const useLogout = () => useContext(AuthOperationContext).logout

export default AuthUserProvider
