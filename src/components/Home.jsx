import React, { useState,useEffect } from 'react';
import { withCookies, useCookies } from 'react-cookie';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';

const Home = (props) =>{
    const [uid,setUid] = useState(0)
    const histroy = useHistory()
    const [cookie] = useCookies(["sid"])
    const handleLink = path => histroy.push(path)

    useEffect(() => {
        setUid(props.user)
    }, []) 
    
    return (
        <div>
            
            { !cookie.sid &&
            <>
                <h1 style={{fontStyle:"italic",textAlign:"center"}}>Please Login</h1>
            
            </>
            }
            {
                cookie.sid &&
                <>

                <h1>おかえりなさい {props.user}</h1>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    className="submit"    
                    onClick={()=>handleLink('/admin')}
                >
                プロフィールへ
             </Button>
                </>
            }
        </div>

    )
}

export default withCookies(Home)

// 特定の名前のcookie取得
// const cookieValue = document.cookie
//   .split('; ')
//   .find(row => row.startsWith('test2'))
//   .split('=')[1];