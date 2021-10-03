import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

const url = process.env.REACT_APP_IP
const One = () =>{
    const {id} = useParams()
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    useEffect(() => {
        axios.get(`${url}/post/${id}`)
        .then((response)=>{
            setTitle(response.data.title)
            setContent(response.data.content)
        })
    }, [])
   
    const tstyle = {
        "border-color": "black",
        "border-width": "2px",
        "padding"     : "10px 0",
        "border-bottom": "5px solid #000",
        "text-align":"left"
    }

    const block = {
        "text-align": "center",
        "margin-left": "auto",
        "margin-right": "auto",
        "width": "90%"
    }

    const imgblock = {
        "margin-left": "auto",
        "margin-right": "auto",
        "width": "60%",
        
        "display":"block"
    }
    return(
        <div style={block}>
            <h1 style={tstyle}>{title}</h1>
            <img src={`${url}/post/getimg/${id}`} style={imgblock}/>
            <br />
           
            <p style={{fontSize:"25px"}}>{content}</p>
            
        </div>
    )
}

export default One