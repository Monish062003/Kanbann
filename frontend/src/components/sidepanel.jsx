import React,{useEffect,useState,useRef} from 'react'
import '../Css/sidepanel.css'
import Sideswift from '../Images/downarrow.png'
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Group from './Group'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import 'animate.css';

function Sidepanel(props) {
  let iterations=2
  let count=0;
  let refreshstopper=0;
  const[group,showgroup]=useState(false)

  useEffect(()=>{
    iterations=2;
    if (refreshstopper == 0) {
      (async()=>{
        let data = await props.data;
        if (data != null) {
          data.map((workspace) => {
            readwrite(workspace);
          });
        }
      })();
    }
    refreshstopper++;
  },[props.data])
  
  const transit=(()=>{
    let wholecontainer=document.querySelector(".side-container");
    let directbutton=document.querySelector(".sidedirect-button");
    let workspacegroup=document.querySelector(".workspace-group");
    let workspacehandler=document.querySelector(".workspacehandler");
    let cardcontainer=document.querySelector(".card-container");
    let innercontainer=document.querySelector(".innercontainer");
    
    if (iterations%2==0) {
      wholecontainer.classList.add("side-container-swipe");
      directbutton.classList.add("sidedirect-button-swipebutton");
      workspacegroup.classList.add("sideopaquetext");
      cardcontainer.classList.add("mincontainer");
      innercontainer.classList.add("mininnercontainer");
      workspacehandler.classList.add("sideopaquetext");
      try {
        cardcontainer.classList.remove("maxcontainer");
        innercontainer.classList.remove("maxinnercontainer");
        wholecontainer.classList.remove("side-container-swipeinv");
        directbutton.classList.remove("sidedirect-button-swipebuttoninv");
        workspacegroup.classList.remove("sideopaquetextinv");
        workspacehandler.classList.remove("sideopaquetextinv");
      } catch (error) {}
    }
    else{
      try {
        cardcontainer.classList.remove("mincontainer");
        innercontainer.classList.remove("mininnercontainer");
        wholecontainer.classList.remove("side-container-swipe");
        directbutton.classList.remove("sidedirect-button-swipebutton");
        workspacegroup.classList.remove("sideopaquetext");
        workspacehandler.classList.remove("sideopaquetext");
      } catch (error) {}
      cardcontainer.classList.add("maxcontainer");
      innercontainer.classList.add("maxinnercontainer");
      wholecontainer.classList.add("side-container-swipeinv");
      directbutton.classList.add("sidedirect-button-swipebuttoninv");
      workspacegroup.classList.add("sideopaquetextinv");
      workspacehandler.classList.add("sideopaquetextinv");
    }
    iterations++;
  })

  const remove=(async(e)=>{
    if (e.target.tagName=="BUTTON") {
      count--;
      let title=e.target.parentElement.children[0].innerHTML?e.target.parentElement.children[0].innerHTML:e.target.parentElement.children[0].name;

      axios.post("http://localhost:80/workspace",{
        email:document.cookie.split("=")[1],
        workspacename:title,
        check:1,
      })
      
      let switchelem = e.target.parentElement.parentElement.children;
      for (let index = 0; index < switchelem.length; index++) {
        if (switchelem[index]==e.target.parentElement) {
          if (index-1>=0 || switchelem.length==undefined) {
            props.changestate(switchelem[index-1].children[0].innerHTML);
          }
          else if(index+1!=switchelem.length){
            props.changestate(switchelem[index+1].children[0].innerHTML);
          }
          else{
            props.changestate("lego batman is awesome")
          }
        }
      }
      e.target.parentElement.remove();
    }
  });
  
  const savetype = async(e) =>{
    if (e.keyCode==13) {
      if (e.target.tagName=="INPUT") { 
        let title=e.target.value;
        let workspace_name=e.target;
        let name=e.target.name;
        let workspace=e.target.parentElement;
        workspace_name.remove();         
        let workspace_newname=document.createElement('div');

        axios.post("http://localhost:80/workspace",{
          email:document.cookie.split("=")[1],
          check:2,
          workspace_new:title,
          workspacename:name
        })
      
        workspace_newname.addEventListener('dblclick',edit)
        workspace_newname.innerHTML=title;
        workspace_newname.name=title;
        workspace.prepend(workspace_newname);
      }
    }
  }
  const edit=(async(e)=>{
    if (e.target.tagName==="DIV") {
      let textbox = document.createElement('input');
      let workspace_name=e.target;
      textbox.type = "text";
      textbox.name = workspace_name.name;

      textbox.classList.add('workspaceheading');
      textbox.addEventListener('keypress',savetype);
      workspace_name.parentElement.prepend(textbox);
      workspace_name.remove();
    }
  });
  
  const changecardspanel=(async(event)=>{
    try {
      if (event.target.tagName=="DIV") {
        let elements = document.getElementsByClassName(event.target.className);
        for (let index = 0; index < elements.length; index++) {
          elements[index].style.background = "rgba(47, 48, 52, 0)"
        }
        
        event.target.style.background = "rgba(96, 89, 89, 0.66)"
        
        let [workspace,title] = [event.target.className=="workspace-group"?event.target.children[0]:event.target,''];
        title=workspace.name?workspace.name:workspace.innerHTML;
        props.changestate(title)
      }
    } catch (error) {
      
    }
  })
  
  const readwrite = (name) =>{
    let workspacetab=document.createElement('div');
    let text=document.createElement('div');
    let button=document.createElement('button');
    let container=document.getElementsByClassName('workspacehandler')[0];
    count++;
    workspacetab.classList.add('workspace-group');
    text.name= name;
    text.addEventListener('dblclick',edit);
    text.innerHTML = name;
    button.innerHTML= " -";
    
    button.classList.add('.workspace-group');
    button.classList.add('button');
    button.addEventListener('click',remove);
    
    workspacetab.addEventListener('click',changecardspanel);
    container.appendChild(workspacetab);
    workspacetab.appendChild(text);
    workspacetab.appendChild(button);
  }
  
  const add=(async()=>{
    if (document.cookie.split("=")[1]) {
      let workspacetab=document.createElement('div');
      let text=document.createElement('div');
      let button=document.createElement('button');
      let container=document.getElementsByClassName('workspacehandler')[0];
      
      count++;
      workspacetab.classList.add('workspace-group');
      text.name=`Workspace ${count}`;
      text.addEventListener('dblclick',edit);
      text.innerHTML = `Workspace ${count}`
      button.innerHTML=" -";
      
      button.classList.add('.workspace-group');
      button.classList.add('button');
      button.addEventListener('click',remove);
      
      workspacetab.addEventListener('click',changecardspanel);
      container.appendChild(workspacetab);
      workspacetab.appendChild(text);
      workspacetab.appendChild(button);

      axios.post("http://localhost:80/workspace",{
        email:document.cookie.split("=")[1],
        workspacename:text.innerHTML,
        check:0,
      })
    }
    else{
      toast.warn('Please Login to your Account')
    }
  });

  const create_group = () =>{
    if (document.cookie.split("=")[1]) {
      showgroup(true)
    }
    else{
      toast.warn('Please Login to your Account')
    }
  }

  const join_group = () =>{
    if (document.cookie.split("=")[1]) {
      
    }
    else{
      toast.warn('Please Login to your Account')
    }
  }


  const call_individuals = (event) =>{
    let targeted = event.target;
    targeted.classList.toggle("rotatetoninty");
    targeted.classList.toggle("rotatetonifty");
  }

  const call_groups = (event) =>{
    let targeted = event.target;
    targeted.classList.toggle("rotatetoninty");
    targeted.classList.toggle("rotatetonifty");
  }

  return (
    <div className='side-container'>
      <div className="nav-direction">
        <button className="sidedirect-button" onClick={transit} >
          <img src={Sideswift} alt="downarrow" />
        </button>
      </div>
      <div className="workspace-group">Individual &nbsp;&nbsp;<button onClick={(e)=>{call_individuals(e)}}><i className="fa-solid fa-caret-down fa-sm rotatetonifty" style={{"color": "#ffffff"}}></i></button></div>
      <div className="workspace-group">Group &nbsp;&nbsp;<button onClick={(e)=>{call_groups(e)}}><i className="fa-solid fa-caret-down fa-sm rotatetonifty" style={{"color": "#ffffff"}}></i></button></div>
      <div className="workspacehandler"></div>
      <div className="workspace-group" style={{"borderTop":"1px solid white","borderBottom":"none"}}>Add a Workspace &nbsp;&nbsp;&nbsp;<button onClick={add}>+</button></div>
      <div className="group-panel">
        <div className="create-group" onClick={create_group}>Create a Group <i className="fa-solid fa-user-group fa-sm"></i></div>
        <div className="join-group" onClick={join_group}>Join a Group <i className="fa-solid fa-users fa-sm"></i></div>
      </div>
      {group && <Group boarddisplay={showgroup} edit={edit} remove={remove} changecardspanel={changecardspanel} />}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        transition= {Bounce}
      />
    </div>
  )
}

export default Sidepanel
