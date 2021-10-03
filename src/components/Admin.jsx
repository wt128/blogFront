import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { useCookies } from 'react-cookie'
import dotenv from 'dotenv'
import { useLogout } from './AuthContext'

dotenv.config()
const url = process.env.REACT_APP_IP

const useStyles = makeStyles({
    bg: {
        borderRadius: "50%",
        margin: "20px 0 0 20px",
        float: "left",
        "&:hover":{
            opacity: 0.5
        }
    }
})

const Admin = (props) =>{
    const [posts ,setPosts] = useState([])
    const [likes,setLikes] = useState([])
    const [cookies] = useCookies(["sid"])
    const [image,setImage] = useState()
    const [btn,setBtn] = useState(false)
    const history = useHistory()
    const classes = useStyles()

    const logout = useLogout()
    

    const frame = {
        "display":  "flex",
        "background": "#fff",
        "border": "1px #ccc solid",
        "box-shadow": "0 6px 8px 0 #ddd",
        "font-size": "100%",
        "padding": "20px",
        "margin":"10px"
    }
    const header = {
        "content": "",
        "display": "#ddd",
        "clear":"both",
        "margin-bottom":"130px"
    }
    const forChild = {    
        "flex-grow": 1,
        "marginLeft": "auto",
        "paddingTop": "45px"
    }

    useEffect(() => {
        
        getPost()
        getLike()
    }, [])
    
    function getPost(){
        axios.get(`${url}/users/${props.uid}`)
            .then((response)=>{               
                setPosts(response.data)
            })
    }

    function getLike(){
        axios.get(`${url}/like/${props.uid}`)
            .then((response)=>{
                setLikes(response.data)
            })
    }

    function handleDelete(pid){
        let result = window.confirm('本当に削除しますか。')
        if(result) {
            axios.post(`${url}/post/destroy`,{
                Sid: cookies.sid,
                PostId: pid
            }).then(()=>{
                //api側からuidを返却して、hook更新、histroyにプッシュに再れんだー
                alert("削除しました。")           
            }).catch(()=>{
                alert("エラーが発生しました.")
            })
        }
    }

    function handleLeave(){
        let result = window.confirm('本当に退会しますか。')
        if(result) {
            axios.post(`${url}/users/destory/${props.uid}`,{
                Sid: cookies.sid,
            }).then(()=>{
                logout()
                props.cookieDelete()
                alert("退会しました。")
                history.push("/")
            }).catch(()=>{
                alert("エラーが発生しました.")
            })
        }
    }

    function handleUpdate(pid){
        history.push({
            pathname: 'posts/update',
            state: {pid: pid}
        })
    }

    function handleRevise(){
        history.push({
            pathname: 'user/update',
            state: {id: props.uid}
        })
    }

    function processImg(e){
        if(!e.target.files){
            setImage()
            setBtn(false)
            return
        }
        const imageFile = e.target.files[0]
        setImage(imageFile)
        setBtn(true)
    }

    function handleImgup(){
        const data = new FormData()
        data.append("file",image)
        data.append("sid",cookies["sid"])
        const header = {"content-type":"multipart/form-data"}
        axios.post(`${url}/users/setimg`,data,{header})
            .then(response =>{
                alert(response.data)
                history.push("/admin")
            })
            .catch(()=>{
                alert("エラーが発生しました。")
            })
    }
    
    return(
        <>
        
            <div className="clearfix" style={header}>
                
                <img className={classes.bg} src={`${process.env.REACT_APP_IP}/users/getimg/${props.uid}`}
                alt="ユーザー画像" onError={(e)=>e.target.src = "example.jpg"} width="300" height="300" />
                
                <div style={{float: "left",margin:"100px 0 0 90px"}}> 
                    <p style={{fontSize:"20px"}}>何をされますか？</p>
                <span style={{margin:"0px 10px"}}>
                    <Button size="medium" color="secondary" variant="contained" onClick={handleLeave}>退会</Button>
                </span>
                <span style={{margin:"0px 10px"}}>
                
                    <Button size="medium" color="secondary" variant="contained" onClick={handleRevise}>
                            個人情報を変更
                    </Button>
                </span>
               
                </div>
            </div>
        
        <div style={{textAlign:"left",clear:"both"}}>
            <p style={{marginBottom:"40px"}}></p>
            <button onClick={()=>{getPost(); getLike()}}>記事を取得</button>
            <span style={{marginRight:"20px"}}></span>
            <label>
                <input type="file" name="file" onChange={processImg} />
            </label>
            {btn && <span style={{marginLeft:"10px"}}><Button size="small" color="secondary" variant="contained" onClick={handleImgup} >変更</Button></span>}
        {
            posts.map((article,key)=>{
                let cnt = 0
                for (let i = 0;i < likes.length; i++){
                        if(article.id === likes[i].Pid){
                            cnt += likes[i].cnt;
                        }
                }

                return(   
                    <>
                    <div style={frame}>
                        <div className="child1">
                            <h2 style={{margin:"0 0 0 0"}}>{article.title}</h2>
                            <p style={{margin:"0 0 0 0"}}>いいね: {cnt}</p>
                            <p>{article.CreatedAt}</p>
                        </div>
                        <div className="child2" style={forChild}>
                            <span>
                                <IconButton>
                                    <DeleteIcon style={{paddingLeft:"20px"}} onClick={()=>handleDelete(article.id)}/>
                                </IconButton>
                                <IconButton>
                                    <CreateIcon style={{paddingLeft:"20px"}} onClick={()=>handleUpdate(article.id)}/>
                                </IconButton>
                            </span>                    
                        </div>
                    </div>
                    </>
                )
            })
        }
        <p>{props.uid}</p>
        </div>
        </>
        )
    }       
export default Admin
