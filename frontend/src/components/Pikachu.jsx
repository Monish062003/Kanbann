import React from 'react'
import axios from "axios"
import random from 'random';

function Pikachu() {
  let data = "Yahoo"
    axios.post('https://server-gray-omega.vercel.app/readworkspace',{
        "email":"mayekarmonish875@gmail.com",
        "workspace":"Workspace 1"
    }).then((response)=>{
      const randomNumber = random.int(0, response['data'][3].length);
      data = response['data'][3][randomNumber]
      console.log(data)
    })
  return (
    <div>{data}</div>
  )
}

export default Pikachu