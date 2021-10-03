import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';

const url = process.env.REACT_APP_IP
const useStyles = makeStyles((theme) => ({
    root:  {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
    },
    }))

const PostNew = (props) =>{
  const [title, setTitle] = useState('')
  const [content,setContent] = useState('')
  const [user,setUser] = useState(0)
  const [image,setImage] = useState()
  const [isVal,setIsVal] = useState(false)
  const [cookies] = useCookies(["sid"])
  const classes = useStyles()
  const histroy = useHistory()
  
  useEffect(() => {
    getId()
   
  }, [])

  function getId(){
    axios.post(`${url}/session`,{
      sid: cookies.sid
    })
      .then((response)=>{
        setUser(response.data.id)
      })
      .catch(()=>{
        alert("エラーが発生しました [session error]")
      })

  }

  function sendPost(e){
      e.preventDefault()
      if(title === '' || content=== ''){
        alert("入力されていない項目があります。")
        setIsVal(true)
        return
      }
      axios.post(`${url}/post/new`,{
          UserId: user,
          Title: title,
          Content: content,
        }).then((response)=>{
          const pid = response.data
            if(image){ sendImg(pid) }
            else{
              alert("投稿しました。")
            }
           
            histroy.push("/posts")
        }).catch((err)=>{
          alert(err.response.data.errorMessages)
          console.log(err)
        })
    }

  function sendImg(pid){
      const data  = new FormData()
      data.append("pid",pid)
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
          }
          else{
            setContent(e.target.value)
          }
    }
    
    return(
    <div style={{"textAlign": "center"}}>
    <h1>記事を投稿</h1>
    <form className = {classes.root} >
      { isVal && <li>入力してください。</li>} 
      <p>        
          サムネイルを設定する
          <span style={{marginRight:"20px"}}></span>
          <input type="file" onChange={(e)=>{setImage(e.target.files[0])}}  />
      </p>
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
          投稿
        </Button>
      </form>
    </div>
    )
}

export default PostNew