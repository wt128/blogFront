import React, { useState,useEffect } from 'react'
import {useCookies} from 'react-cookie'
import { BrowserRouter as Router, Redirect, Route ,Switch} from "react-router-dom";
import Form from './New'
import Show from './Show'
import Home from './Home'
import Navbar from './Navbar'
import Login from './Login'
import User from './User'
import UserRevise from './UserRevise'
import Admin from './Admin'
import axios from 'axios'
import One from './One'
import Update from './Update'
import PostNew from './Post'
import AuthUserProvider,{useAuthUser, useLogin} from './AuthContext';
import Pagenation  from './Pagination';


function NotFound() {
  return <h1>404</h1>
}

const PrivateRoute = ({...props}) =>{
  const authUser = useAuthUser()
  const isAuthenticated = authUser != false //認証されているかの判定
  if (isAuthenticated) {
    return <Route {...props}/>
  } else {
    console.log(`ログインしていないユーザーは${props.path}へはアクセスできません`)
    return <Redirect to={{pathname: "/login", state: {from: props.location.pathname}}}/>
  }
}

const UnAuthRoute = ({...props}) =>{
  const authUser = useAuthUser()
  const isAuthenticated = authUser != false
  if (isAuthenticated) {
    console.log(`ログイン済みのユーザーは${props.path}へはアクセスできません`)
    return <Redirect to="/" />
  } else {
    return <Route {...props}/>
  }
}

const App = ()=> {
  
  const [user,setUser] = useState(0)
  const [cookies, setCookie, removeCookie] = useCookies(["sid"]);
  const login = useLogin()

  useEffect(() => {
    if(cookies.sid){
    axios.post(`${process.env.REACT_APP_IP}/session`,{
      sid: cookies.sid
    })
      .then((response)=>{
        login()
        setUser(response.data.id)
      })
      .catch(()=>{
        alert("エラーが発生しました [session error]")
      })
    }
  }, [])

  const cookieDelete = () =>{
    removeCookie("sid")
  }
  const cookieSubmit = (data) =>{
    setCookie("sid",data)
  }
  
    return (
  <>
   
    <AuthUserProvider>
      <Router>
        <Navbar cookieDelete={cookieDelete} uid={user} />
        <Switch>
          <Route exact path="/" render={()=> <Home user={user} />}></Route>
          <PrivateRoute path="/admin"  render={()=> <Admin cookieDelete={cookieDelete} uid={user} />}></PrivateRoute>
          <UnAuthRoute path="/new"    render={()=>  <Form cookieSubmit={cookieSubmit}  />}></UnAuthRoute>
          <UnAuthRoute path="/login"  render={()=> <Login cookieSubmit={cookieSubmit}  />}></UnAuthRoute>
          <PrivateRoute exact path="/user/update" render={()=> <UserRevise />}></PrivateRoute>      
          <Route exact path="/user/:id"   render={()=> <User />}></Route>
          <Route exact path="/posts" render={()=> <Pagenation /> }></Route>
          <PrivateRoute path="/posts/new" render={()=> <PostNew/>}></PrivateRoute>
          <PrivateRoute path="/posts/update" render={()=><Update />}></PrivateRoute>
          <Route path="/posts/:id" render={()=> <One/>}></Route>
        
        </Switch>
      </Router>
    </AuthUserProvider>
  </>

    )
  
}

export default App