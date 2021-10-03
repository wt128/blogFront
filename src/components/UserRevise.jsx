import React, {useState,useEffect,useParams} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert  from '@material-ui/lab/Alert';
import https from 'https';
import { useCookies } from 'react-cookie';
import { useHistory,useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
    root: {
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
    },
    },
    val: {
    width: '100%',
    '& > * + *': {
        marginTop: theme.spacing(2),
    },
    marginLeft: '300px',
    marginRight: '300px',
    },
}
))

const UserRevise = () =>{
    const classes = useStyles()
    const [email,setEmail] = useState('')
    const [password,setPass] = useState('')
    const [confirm,setConfirm] = useState('')
    const [val,setVal] = useState([])
    const history = useHistory()
    const location = useLocation()
    const [cookies] = useCookies(["sid"])
    const fieldcase =[
        "standard-basic",
        "standard-error-helper-text"
    ]
    
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    })
    
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_IP}/session/email`,{
            sid:    cookies.sid
        }).then((response)=>{
            setEmail(response.data.email)
        }).catch((err)=>{
            alert(err.response.data.errorMessages)
        })
        
       
    }, [])

    function sendNew(e){
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_IP}/users/update`,{
        withCredentials: true,
        ID: location.state.id,
        Email: email,
        Confirm: confirm,
        Password: password,
        httpsAgent
            }).then((response) =>{
            alert("変更しました。")
            history.push("/")
        }).catch(error => {
            if(error.response.data === undefined){
                return 
            }
            let a = error.response.data.errorMessages
            if (typeof a === "string"){
                a = []
                a.push(error.response.data.errorMessages)     
            } else {
                a = []
                a.push("予期せぬエラーが起きました。")
            }
            setVal(a)    
        })
    }



    function handleChange(e){
        if(e.target.name === "email"){
        setEmail(e.target.value)
        } else if(e.target.name === "confirm"){
        setConfirm(e.target.value)
        } else{
        setPass(e.target.value) 
        }
    }
    
    return (
        <div style={{textAlign: "center"}}>
    
        <h1>ユーザー情報の更新</h1>
        <div>
            
            {
            val.length > 0 &&
            val.map((ele,key) => {
                return(
                <Alert severity="error">
                    <li id={key}>{ele}</li> 
                </Alert>
            )})
            
    }
    </div>         
        <form className={classes.root} 
        noValidate autoComplete="off">
        <h2>新しいメールアドレス</h2>
        <div>
        <TextField id={fieldcase[0]}
            name="email" 
            value={email} 
            onChange={handleChange}
            />
        </div>
        
        <h2>今までのパスワード</h2>

        <div>
        <TextField id={fieldcase[0]}
            name="confirm" 
            type="Password" 
            onChange={handleChange}
            value={confirm} />
        </div>

        <h2>新しいパスワード</h2>

        <div>
        <TextField id={fieldcase[0]}
            name="password" 
            type="Password" 
            onChange={handleChange}
            value={password} />
        </div>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            className="submit"    
            onClick={sendNew}   
            >
            変更
            </Button>
    
            </form>
        </div>
    )}
        
    export default UserRevise