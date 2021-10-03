import React,{useState,useEffect} from 'react'
import OnePost from './Card.jsx'
import axios from 'axios'
import {Grid} from '@material-ui/core'
import { useCookies } from 'react-cookie'

const Show = (props) =>{
    const [posts,setPosts] = useState([])
    const [cnt,setCnt] = useState([])
    const [user,setUser] = useState(0)
    const [check,setCheck] = useState([])
    const [cookies] = useCookies(["sid"])
    const url = process.env.REACT_APP_IP

    useEffect (
      () => {
        //getPost()
        getLike()
        if(cookies["sid"]){
          GetId() 
        }
      },
      []
    )
    
    function getLike(){
      axios.get(`${url}/like`)
        .then((response)=>{
          setCnt(response.data)
        })
    }

    const GetId = () =>{
      axios.post(`${url}/session`,{
        sid: cookies.sid
      })
        .then((response)=>{
          setUser(response.data.id)
          checkLike(response.data.id)
        })
        .catch(()=>{
          console.log("エラーが発生しました [session error]")
        })
    }

    const checkLike = (id) =>{
      axios.get(`${url}/like/check/${id}`)
          .then((response)=>{
            setCheck(response.data)
          })
    }
    
    return(
      <div>
          <Grid container >
      
            {
              props.posts.map((data,key)=>{

                const pid = data.id
                let postcnt = 0
                //動かす値 pid or cnt
                for(let i = 0;i<cnt.length;i++){
                  if(cnt[i].pid === pid){
                    postcnt += cnt[i].cnt
                    }
                }
            
                return(
                  <Grid item xs={6} sm={3}>                
                    <OnePost data={data} cnt={postcnt} uid={user} check={check}/> 
                  </Grid> 
                )
              })
            
            }
          
          </Grid>
          </div>
    )
}

export default Show