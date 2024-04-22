import React, { useState } from 'react';
import '../Css/group.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JoinG(props) {
  const [display, setDisplay] = useState({
    txtval: '',
    copiedText: '',
    dis: false,
    group_users : ''
  });
  let storeprev='';
  const cpfunction = () =>{
    navigator.clipboard.writeText(localStorage.getItem('random'));
    toast.success('Copied to Clipboard!');
  }
  
  const searchGroup = async() => {
    if (display.txtval) {
      const search_result = await axios.post('http://localhost:80/handlegroup',{
        email:document.cookie.split("=")[1],
        name:document.cookie.split("=")[0],
        code:display.txtval,
        partition:0
      });
      localStorage.setItem('code',display.txtval);
      let group_use = await search_result.data[display.txtval].users;
      setDisplay({ ...display, copiedText: `${await search_result.data[display.txtval].workspaces[0]}`, dis: true,['group_users']:`Admin : ${group_use[0]}`});
    }
  }

  const registerGroup = async() =>{
    if (display.txtval || localStorage.getItem('code')) {
      const search_result = await axios.post('http://localhost:80/handlegroup',{
        email:document.cookie.split("=")[1],
        name:document.cookie.split("=")[0],
        code:localStorage.getItem('code'),
        partition:1
      });

      const workspacename = await search_result.data[localStorage.getItem('code')].workspaces[0];
      let workspacetab=document.createElement('div');
      let text=document.createElement('div');
      let button=document.createElement('button');
      let container=document.getElementsByClassName('workspacehandler')[1];

      workspacetab.classList.add('workspace-group');
      text.name=workspacename
      text.addEventListener('dblclick',props.edit);
      text.innerHTML = workspacename;
      button.innerHTML=" -";

      button.classList.add('.workspace-group');
      button.classList.add('button');
      button.addEventListener('click',props.remove);
      
      workspacetab.addEventListener('click',props.changecardspanel);
      container.appendChild(workspacetab);
      workspacetab.appendChild(text);
      workspacetab.appendChild(button);

      let terminator = props.boarddisplay
      terminator(false)
      localStorage.removeItem('code')
      setDisplay({ ...display, copiedText: `Joined`, dis: true,});
    }
  }

  const terminate = () =>{
    let terminator = props.boarddisplay
    terminator(false)
  }

  return (
    <>
    {props.boarddisplay && (
      <div className='all'>
        <div className='grouppanel'>
          <div className="createg_title"><h2>Join a Group</h2><i onClick={terminate} className="fa-regular fa-circle-xmark fa-xl" style={{"color": "#ffffff"}}></i></div>
          <h3>Enter Group Code</h3>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-user-group fa-sm"></i></span>
            <input type="text" className="form-control" name='txtval' aria-label="Username" value={display.txtval} onChange={(e) => { setDisplay({ ...display, [e.target.name]: e.target.value }) }} aria-describedby="basic-addon1" />
          </div>
          <button type="button" className="btn btn-outline-success" onClick={searchGroup}>Search</button>
          {display.dis && (
            <div style={{textAlign: "center"}}>
              <div className="clipboard">
                <h3 onClick={cpfunction}><i className="fa-solid fa-people-group fa-xl" style={{"color": "#ffffff"}}></i>
                <b>{display.copiedText} Group</b></h3>
                <button type="button" className="btn btn-outline-success" onClick={registerGroup}>Join</button>
              </div>
              <b style={{color:"white",position:"relative",bottom:"15px"}}>{display.group_users}</b>
            </div>
          )}
        </div>
    </div>
    )}
    </>
  )
}
