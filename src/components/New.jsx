import React, {useState} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert  from '@material-ui/lab/Alert';
import https from 'https';
import { useHistory } from 'react-router';
import { useLogin } from './AuthContext';

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

const Form = (props) => {
  const classes = useStyles()
  const [email,setEmail] = useState('')
  const [password,setPass] = useState('')
  const [val,setVal] = useState([])
  const history = useHistory()
  const login = useLogin()
  const fieldcase =[
    "standard-basic",
    "standard-error-helper-text"
  ]
  ////
  ///086665456t

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  })

  function sendNew(e){
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_IP}/users`,{
      withCredentials: true,
      Email: email,
      Password: password,
      httpsAgent
       }).then((response) =>{
        props.cookieSubmit(response.data.sid)
        login()
        history.push("/")
      }).catch(error => {
        if(error.response.data === undefined){
          return 
        }
        let a = error.response.data.errorMessages
        if (typeof a === "string"){
          a = []
          a.push(error.response.data.errorMessages)        
        } else if(!a) {
          a.push("予期せぬエラーが起きました。")
        }
        setVal(a)
      
    })
  }

  // function checkUser(e){
  //   firebase.auth().createUserWith
  // } firebase

  function handleChange(e){
    if(e.target.name === "email"){
      setEmail(e.target.value)
    }
    else{
      setPass(e.target.value)
    }
  }

  return (
    <div style={{textAlign: "center"}}>

      <h1>新規登録</h1>
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
      <h2>メールアドレス</h2>
      <div>
      <TextField id={fieldcase[0]}
        name="email" 
        value={email} 
        onChange={handleChange}
        helperText="" />
      </div>
      <h2>パスワード</h2>
      
      <div>
      <TextField id={fieldcase[0]}
        name="password" 
        type="Password" 
        onChange={handleChange}
        value={password} helperText=""/>
      </div>
      <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          className="submit"    
          onClick={sendNew}   
        >
          Save
        </Button>

        </form>
      </div>
      )}
  
export default Form