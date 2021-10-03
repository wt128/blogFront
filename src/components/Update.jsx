import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory, useLocation } from 'react-router';

const url = process.env.REACT_APP_IP
const useStyles = makeStyles((theme) => ({
    root:  {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
    },
    }))

const Update = (props) =>{
  const [title, setTitle] = useState('')
  const [content,setContent] = useState('')
  const [image,setImage] = useState()
  const history = useHistory()
  const [isVal,setIsVal] = useState(false)
  const [cookies] = useCookies(["sid"])
  const location = useLocation()
  const classes = useStyles()
  
  useEffect(() => {
    getPost()
  }, [])

//強制ブラウズ防止のためセッションidをサーバー側でcheckする
  
  function getPost(){
      axios.get(`${url}/post/${location.state.pid}`)
        .then((response)=>{
            setTitle(response.data.title)
            setContent(response.data.content)   
        })
        .catch((err)=>{
            alert(err.response.data)
        })
  }

  function sendPost(e){
      e.preventDefault()
      if(title === '' || content=== ''){
        alert("入力されていない項目があります。")
        setIsVal(true)
        return
      }
      axios.post(`${url}/post/update`,{
          Sid: cookies.sid,
          Id: location.state.pid,
          Title: title,
          Content: content,
        }).then((response)=>{
          if(image){
            sendImg(response.data)
          }
            else { alert("成功しました。") }
            history.push("/")
        }).catch((err)=>{
          alert(err.response.data.errorMessages)
          console.log(err)
        })
    }

  function sendImg(pid){
    const data  = new FormData()
    
    data.append("file",image)
    data.append("sid",cookies["sid"])
    const header={"content-type":"multipart/form-data"}
    axios.post(`${url}/post/setimg/${pid}`,data,{header})
      .then(()=>{
        alert("投稿しました。")
      })
      .catch(()=>{
        alert("サムネイルの投稿に失敗しました。")
      })
  }
  
  function handleChange(e){
      e.preventDefault()
      if(e.target.name === "title"){
            setTitle(e.target.value)
          } else{
            setContent(e.target.value)
          }
    }


    
    return(
    <div style={{"textAlign": "center"}}>
    <h1>編集</h1>
    <p>        
      サムネイルを設定する
      <span style={{marginRight:"20px"}}></span>
      <input type="file" onChange={(e)=>{setImage(e.target.files[0])}}  />
    </p>
    <form className = {classes.root} >
      { isVal && <li>入力してください。</li>} 
      <img src="susu.jpg" /><br/>
        <TextField
          id="outlined-textarea"
          name="title"
          label="タイトル"
          onChange={handleChange}
          value={title}
          multiline
          variant="outlined"
        />
         
        <br/>
        <TextField
            id="outlined-textarea"
            label="本文"
            name="content"
            value={content}
            onChange={handleChange}
            multiline
            rows={10}
            cols={20}
            variant="outlined"
      />
        <br/>
        <Button onClick={sendPost} variant="contained" size="large" color="primary" className={classes.margin}>
          変更する。
        </Button>
      </form>
    </div>
    )
}

export default Update