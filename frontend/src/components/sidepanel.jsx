import React,{useEffect,useState} from 'react'
import '../Css/sidepanel.css'
import Sideswift from '../Images/downarrow.png'

function Sidepanel(props) {
  let iterations=2
  let count=0;
  let refreshstopper=0;
  
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
  
  let transit=(()=>{
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

  let remove=(async(e)=>{
    if (e.target.tagName=="BUTTON") {
      count--;
      let title=e.target.parentElement.children[0].innerHTML?e.target.parentElement.children[0].innerHTML:e.target.parentElement.children[0].name;
      fetch('https://serverhost-chi.vercel.app/workspace',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email:document.cookie.split("=")[1],
          workspacename:title,
          check:1,
        })
      });
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
  
  let savetype = async(e) =>{
    if (e.keyCode==13) {
      if (e.target.tagName=="INPUT") { 
        let title=e.target.value;
        let workspace_name=e.target;
        let name=e.target.name;
        let workspace=e.target.parentElement;
        workspace_name.remove();         
        let workspace_newname=document.createElement('div');

        fetch('https://serverhost-chi.vercel.app/workspace',{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email:document.cookie.split("=")[1],
            check:2,
            workspace_new:title,
            workspacename:name
          })
        });
      
        workspace_newname.addEventListener('dblclick',edit)
        workspace_newname.innerHTML=title;
        workspace_newname.name=title;
        workspace.prepend(workspace_newname);
      }
    }
  }
  let edit=(async(e)=>{
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
  
  let changecardspanel=(async(event)=>{
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
  
  let add=(async()=>{
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

    fetch('https://serverhost-chi.vercel.app/workspace',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email:document.cookie.split("=")[1],
        workspacename:text.innerHTML,
        check:0,
      })
    });

    // props.sender(true);
  });

  return (
    <div className='side-container'>
      <div className="nav-direction">
        <button className="sidedirect-button" onClick={transit} >
          <img src={Sideswift} alt="downarrow" />
        </button>
      </div>
      <div className="workspace-group">Add a Workspace &nbsp;&nbsp;&nbsp;<button onClick={add}>+</button></div>
      <div className="workspacehandler"></div>
    </div>
  )
}

export default Sidepanel
