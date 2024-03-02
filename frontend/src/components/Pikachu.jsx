import React,{useRef} from 'react'
import axios from "axios"
import random from 'random';

function Pikachu() {
  let data = useRef('Temple');
    axios.post('https://serverhost-rho.vercel.app/readworkspace',{
        "email":"mayekarmonish875@gmail.com",
        "workspace":"Workspace 1"
    }).then((response)=>{
      const randomNumber = random.int(0, response['data'][3].length);
      data = response['data'][3][randomNumber]
    })
  return (
    <div>{data.current}</div>
  )
}

export default Pikachu