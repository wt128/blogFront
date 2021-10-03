import React, {useState,useEffect} from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const url = process.env.REACT_APP_IP;

const User = (props) => {
    const [posts ,setPosts] = useState([])
    const [likes,setLikes] = useState([])
    const {id} = useParams()
    const [user,setUser] = useState(0)
    
    const frame = {
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
        "padding-bottom":"190px"
    }

    useEffect(() => {
        let uid = props.uid
        if(!props.admin){
            uid = id
            
        }
        getPost(uid)
        getLike(uid)
    }, [user])
    
    function getPost(uid){
        axios.get(`${url}/users/${uid}`)
            .then((response)=>{
                setPosts(response.data)
            })
    }

    function getLike(uid){
        axios.get(`${url}/like/${uid}`)
            .then((response)=>{
                setLikes(response.data)
            })
    }

    return(
        <>
        <div className="clearfix" style={header}>
            <img style={{float:"left",borderRadius:"50%"}} src={`${url}/user/getimg/${id}`} alt="sample" />
            <h2>{id}の記事一覧</h2>
        </div>
        <div style={{textAlign:"left"}}>
    
        {
            posts.map((article,key)=>{
                let cnt = 0
                for (let i = 0;i < likes.length; i++){
                        if(article.id === likes[i].Pid)
                            cnt += likes[i].cnt; 
                }

                return(   
                    <>
                    <div style={frame}>
                        <h2 style={{margin:"0 0 0 0"}}>{article.title}</h2>
                        <p style={{margin:"0 0 0 0"}}>いいね: {cnt}</p>
                        <p>{article.CreatedAt}</p>
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

export default User