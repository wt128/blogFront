import React,{useState,useEffect} from 'react'
import Pagination from '@material-ui/lab/Pagination'
import  CircularProgress  from '@material-ui/core/CircularProgress'
import Typography  from '@material-ui/core/Typography'
import axios from 'axios'
import Show from './Show'
const url = `${process.env.REACT_APP_IP}/post`

const Pagenation = () =>{
  
    const perPage = 6
    const [current,setCurrent] = useState(1)
    const [data,setData] = useState([])
    const [total,setTotal] = useState(0)
    const [load,setLoad] = useState(false)
    
    useEffect(() => {
        axios.get(`${url}/total`) //ここで総数を問い合わせる
             .then((response)=>{
                 setTotal(response.data) 
             })
        axios.get(`${url}/show`)
             .then((response)=>{
                 setData(response.data)
                 setLoad(true)
             })
     }
     , [])
    function loadPosts(page){
        setLoad(false)
        axios.get(`${url}/show`,{
            params:{
                p: page
            }
        
        }).then((response)=>{
            setData(response.data)
            setLoad(true)
        }).catch(()=>{
            alert('エラーが発生しました.')
        })
    }
  
    const handleChange = (event, value) => {
        const page = value
        setCurrent(page) 
        loadPosts(page)
      };
    const ulCenter = {
        "display": "flex",
        "align-items": "center",
        "flex-direction": "column"
    }
    return(
    <>
    <div style={ulCenter}>
        <h1 style={{fontFamily:"TBUDGothic"}}>記事</h1>
        <Pagination 
            count={total} color="primary" size="large" variant="outlined"
            page={current}
            style={{listStyle:"disc", paddingLeft:"15px"}}
            onChange={handleChange}
        />
        <Typography>Page: {current} </Typography>
    </div>
        {load ? <Show posts={data} /> : <CircularProgress size="40px"/>}
    </>
    )
}

export default Pagenation