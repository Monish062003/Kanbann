import React, { useEffect, useState } from 'react'
import '../Css/navbar.scss'
import { auth, provider } from '../googleauth/login'
import { signInWithPopup } from 'firebase/auth';
import axios from "axios"
import { useAppSelector, useAppDispatch } from '../Slicers/hooks';
import { createuser } from '../Slicers/slice';

function Navbar(): JSX.Element {
  const [btnname, setbtnname] = useState('Login with Google');
  const dispatch = useAppDispatch();
  let refreshstopper = 0;

  useEffect(() => {
    if (refreshstopper == 0) {
      if (document.cookie.split("=")[1] != undefined) {
        setbtnname('Signout')
      }
    }
    refreshstopper++;
  }, [])

  const Login = ((dates: any) => {
    signInWithPopup(auth, provider).then(async (data) => {
      dispatch(createuser({ username: data.user.displayName, email: data.user.email }));
    });
  });

  // const Login = ((dates: any) => {
  //   signInWithPopup(auth, provider).then(async (data) => {
  //     dispatch(createuser({ username: data.user.displayName, email: data.user.email }))
  //     // document.cookie = `${data.user.displayName}=${data.user.email}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  //     // let response: any = axios.post("https://server-gray-omega.vercel.app/email", {
  //     //   "email": `${data.user.email}`,
  //     //   "dates": dates
  //     // })

  //     // response = await response;
  //     // response = response['data'];
  //     // if (response != "") {
  //     //   window.location.reload();
  //     // }
  //   });
  // });

  // const SignOut = () => {
  //   localStorage.clear();
  //   document.cookie = document.cookie.split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  //   document.cookie = document.cookie.split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  // }

  const Check = () => {
    let date = new Date();
    if (btnname === 'Login with Google') {
      let dates = [date.getDate(), date.getMonth() + 1, date.getFullYear(), date.getHours(), date.getMinutes()];
      Login(dates);
      setbtnname('Signout');
    } else {
      // SignOut();
      setbtnname('Login with Google')
      // const widow: any = window
      // widow.location.reload(true);
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
