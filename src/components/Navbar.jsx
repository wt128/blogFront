import { AppBar, makeStyles } from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React from 'react';
import { useCookies } from "react-cookie";
import {useHistory,Route} from 'react-router-dom';
import UserIcon from '../img/susu.jpg';
import {useLogout} from './AuthContext'

const useStyle = makeStyles((theme) => ({
    color: 'blue',
    menuButton: { marginRight: theme.spacing(2)},
    title: {flexGrow: 1},
}))

const imgStyle = {
    "border-radius": "50%",
    "width":  "50px",
    "height": "50px",
    "margin-left": "5px",
    "padding": "0px 3px 0px 0px"
}

const Navbar = (props) =>{
    const classes = useStyle()
    const history = useHistory()
    const logout = useLogout()
    const handleLink = path => history.push(path)
    const [cookie] = useCookies(["sid"]) 
    const handleLogout = () =>{
        
        alert("ログアウトしました。[Session delete]")    
        props.cookieDelete()
        setTimeout(3000)
        logout()
        history.push("/")
        
    }

    
    return(
        <AppBar position="static">
            <Toolbar>
                <img className="myStyle" src={props.uid ? `${process.env.REACT_APP_IP}/users/getimg/${props.uid}` : "susu.jpg"}
                 style={imgStyle} onClick={()=>handleLink('/admin')}
                 onError={(e)=>e.target.src = "susu.jpg"}></img>
                <Typography variant="h6" className={classes.title} onClick={()=>handleLink('/posts')}>
                   ぶろぐ？
                </Typography>

            { !cookie.sid &&
            <div>
                <Button color="inherit" onClick={()=>handleLink('/login')}>
                    Login
                </Button>

                <Button color="inherit" onClick={()=>handleLink('/new')}>
                    Sign up
                </Button>
            </div>
            }
            {
                cookie.sid &&
                <>
                <Button color="inherit" onClick={()=>handleLink('/posts/new')}>
                    Post
                </Button>
                <Button color="inherit" onClick={()=>handleLogout()}>
                    Logout
                </Button>
                </>
            }
            </Toolbar>
        </AppBar>
    )
}

export default Navbar 