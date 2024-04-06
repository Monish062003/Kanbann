import React, { useState } from 'react';
import '../Css/group.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Group(props) {
  const [display, setDisplay] = useState({
    txtval: '',
    copiedText: '',
    dis: false
  });
  
  const random = uuidv4();
  const cpfunction = () =>{
    navigator.clipboard.writeText(localStorage.getItem('random'));
    toast.success('Copied to Clipboard!');
  }
  
  const createGroup = async() => {
    if (display.txtval) {
      const date = new Date()
      let dates = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes()];
      let workspacetab=document.createElement('div');
      let text=document.createElement('div');
      let button=document.createElement('button');
      let container=document.getElementsByClassName('workspacehandler')[0];
      
      workspacetab.classList.add('workspace-group');
      text.name=display.txtval;
      text.addEventListener('dblclick',props.edit);
      text.innerHTML = display.txtval;
      button.innerHTML=" -";
      
      button.classList.add('.workspace-group');
      button.classList.add('button');
      button.addEventListener('click',props.remove);
      
      workspacetab.addEventListener('click',props.changecardspanel);
      container.appendChild(workspacetab);
      workspacetab.appendChild(text);
      workspacetab.appendChild(button);

      await axios.post('http://localhost:80/groupmail',{
        email:(document.cookie).split("=")[1],
        groupcode:random,
        workspacename:display.txtval,
        "dates": dates,
      })
      localStorage.setItem('random',random);
      setDisplay({ ...display, copiedText: `${random}`, dis: true, txtval:''});
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
            <div className="createg_title"><h2>Create Panel</h2><i onClick={terminate} className="fa-regular fa-circle-xmark fa-xl" style={{"color": "#ffffff"}}></i></div>
            <h3>Enter Group Name</h3>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-user-group fa-sm"></i></span>
              <input type="text" className="form-control" name='txtval' aria-label="Username" value={display.txtval} onChange={(e) => { setDisplay({ ...display, [e.target.name]: e.target.value }) }} aria-describedby="basic-addon1" />
            </div>
            <button type="button" className="btn btn-outline-success" onClick={createGroup}>Create</button>
            {display.dis && (
              <div className="clipboard">
                <h3 onClick={cpfunction}>{display.copiedText}</h3>
                <i onClick={cpfunction} className="fa-regular fa-clipboard fa-flip-horizontal fa-2xl" style={{ "color": "#198754" }}></i>
              </div>
            )}
          </div>
      </div>
      )}
    </>
  )
}
