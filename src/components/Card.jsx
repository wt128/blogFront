import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios';


const useStyles = makeStyles(()=> ({
  root: {
    minWidth: 200,
    margin: 5, 
  },
  media: {
    height: 140,
  }
}))


const Part = (props) =>{
  const classes = useStyles();
  const [isLike,setIsLike] = useState(true)
  const history = useHistory()
  const [cont,setCont] = useState(props.cnt)
  const handleLink = () => history.push(`posts/${props.data.id}`)
  
  const url = process.env.REACT_APP_IP
  

  function oneLike(e){
    e.preventDefault()
    const pid =  props.data.id
    const uid =  props.uid
    if(isLike){
      setIsLike(false)
      setCont((prev)=>prev+1)
      axios.post(`${url}/like/create`,{
        UserID: uid,
        PostID: pid
      }).catch((err) =>{
        alert("エラーが発生しました.")
      })
  } else{
      setIsLike(true)
      setCont((prev)=>prev-1)
      axios.post(`${url}/like/destroy`,{
        UserID: uid,
        PostID: pid
      }).catch((err)=>{
        alert("エラーが発生しました.")
      })
  }
}

return (
    <Card className={classes.root} variant="outlined">
      <CardActionArea>
        <CardMedia
          className={classes.media}
          title="Contemplative Reptile"
          image={props.data.isimg ? `${url}/post/getimg/${props.data.id}` : ""}
        />
        <CardContent onClick={handleLink}>
          <Typography gutterBottom variant="h4" component="h1">
            {props.data.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <Typography variant="body2" component="p" >
      <Avatar alt="Remy Sharp" src={props.data.isimg ? `${url}/users/getimg/${props.data.UserID}`:""} onClick={()=>history.push(`user/${props.data.UserID}`)}/>
        投稿者: {props.data.UserID}
        <br />
        記事No. {props.data.id}
      </Typography>
      <CardActions>
        <FavoriteIcon  color = {isLike ? "" : "secondary"} onClick={oneLike} />
          <span style={{"margin-right":"1px"}}></span>
          <p>{cont}</p>
      </CardActions>
    </Card>
  
  );
}

export default Part