import React,{useEffect, useState} from 'react'
import  '../Css/navbar.css'
import {auth,provider} from '../googleauth/login'
import { signInWithPopup } from 'firebase/auth';
import axios from "axios"

function Navbar() {
  const[btnname,setbtnname]=useState('Login with Google');
  let refreshstopper = 0;
  
  useEffect(()=>{
    if (refreshstopper==0) {
      if (document.cookie.split("=")[1]!=undefined) {
        setbtnname('Signout')
      }
    }
    refreshstopper++;
  },[])
  
  const Login=((dates)=>{
    signInWithPopup(auth,provider).then(async(data)=>{
      document.cookie = `${data.user.displayName}=${data.user.email}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
      let response = axios.post("http://localhost:80/email",{
        "email": `${data.user.email}`,
        "dates": dates
      })
      
      response = await response;
      response = response['data'];
      if (response != "") {
        window.location.reload();
      }
    });
  });
  
  const SignOut = () =>{
    localStorage.clear();
    document.cookie = document.cookie.split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    document.cookie = document.cookie.split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  }
  
  const Check = () =>{
    let date = new Date();
    if (btnname==='Login with Google') {
      let dates = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes()];
      Login(dates);
      setbtnname('Signout');
    } else {
      SignOut();
      setbtnname('Login with Google')
      window.location.reload(true);
    }
  }
  return (
    <div className='nav'>
      <div className="title">Kanban</div>
      <button className='login' name='btn' onClick={Check}>{btnname}</button>
    </div>
  )
}
export default Navbar
