import React, { useEffect, useState, useRef } from "react";
import "../Css/sidepanel.scss";
import Sideswift from "../Images/downarrow.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Group from './Group'
// import JoinG from './JoinG'
import { useAppDispatch } from "../Slicers/hooks";
import { useSelector } from "react-redux";
import {
  sidepanelHandle,
  removeWorkspaceDB,
  addWorkspaceDB,
} from "../Slicers/slice";
import { stat } from "fs";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Bounce } from "react-toastify";
// import "animate.css";

function Sidepanel() {
  let totalbooleans: any = [];
  const [workspaces, setworkspaces] = useState<string[]>([]);
  const [displayworkspaces, setdisplayer] = useState({
    Individual: true,
    Group: false,
    iterations: true,
    spacehandler: [],
  });
  const [group, showgroup] = useState(false);
  const [jgroup, showjgroup] = useState(false);
  const dispatch = useAppDispatch();
  const data: any = useSelector((state: any) => state.user_data_reducer.data);
  const Object_id = useSelector(
    (state: any) => state.user_data_reducer.Object_id
  );
  const iterations = useSelector((state: any) => state.user_data_reducer.data);

  useEffect(() => {
    const topLevelKeys = Object.keys(
      data.reduce((acc: any, obj: any) => ({ ...acc, ...obj }), {})
    );
    setworkspaces(topLevelKeys);
    for (let index = 0; index < topLevelKeys.length; index++) {
      totalbooleans.push(true);
    }
    setdisplayer((prevDisplayWorkspaces) => ({
      ...prevDisplayWorkspaces,
      spacehandler: totalbooleans,
    }));
  }, [data]);

  useEffect(() => {
    setdisplayer((prevDisplayWorkspaces) => ({
      ...prevDisplayWorkspaces,
      iterations: iterations,
    }));
  }, [iterations]);

  const transit = () => {
    setdisplayer((prevDisplayWorkspaces) => {
      const newIterations = !prevDisplayWorkspaces.iterations;
      dispatch(sidepanelHandle(newIterations));
      return {
        ...prevDisplayWorkspaces,
        iterations: newIterations,
      };
    });
    // const wholecontainer = document.querySelector(".side-container");
    // const directbutton = document.querySelector(".sidedirect-button");
    // const workspacegroup = document.querySelectorAll(".workspace-group");
    // const workspacehandler = document.querySelectorAll(".workspacehandler");
    // const cardcontainer = document.querySelector(".card-container");
    // const innercontainer = document.querySelector(".innercontainer");
    // const groups = document.querySelectorAll(".join-group");
    // const isEvenIteration = iterations % 2 === 0;
    // const posdown = document.getElementsByClassName('posdown')[0];
    // for (let index = 0; index < workspacegroup.length; index++) {
    //   workspacegroup[index].classList.toggle("sideopaquetext", isEvenIteration);
    // }
    // for (let index = 0; index < workspacehandler.length; index++) {
    //   workspacehandler[index].classList.toggle("sideopaquetext", isEvenIteration);
    // }
    // for (let index = 0; index < groups.length; index++) {
    //   groups[index].classList.toggle("sideopaquetext", isEvenIteration);
    // }
    // wholecontainer.classList.toggle("side-container-swipe", isEvenIteration);
    // directbutton.classList.toggle("sidedirect-button-swipebutton", isEvenIteration);
    // cardcontainer.classList.toggle("mincontainer", isEvenIteration);
    // innercontainer.classList.toggle("mininnercontainer", isEvenIteration);
    // try {
    //     for (let index = 0; index < workspacegroup.length; index++) {
    //       workspacegroup[index].classList.toggle("sideopaquetextinv", !isEvenIteration);
    //     }
    //     for (let index = 0; index < workspacehandler.length; index++) {
    //       workspacehandler[index].classList.toggle("sideopaquetextinv", !isEvenIteration);
    //     }
    //     for (let index = 0; index < groups.length; index++) {
    //       groups[index].classList.toggle("sideopaquetextinv", !isEvenIteration);
    //     }
    //   cardcontainer.classList.toggle("maxcontainer", !isEvenIteration);
    //   innercontainer.classList.toggle("maxinnercontainer", !isEvenIteration);
    //   wholecontainer.classList.toggle("side-container-swipeinv", !isEvenIteration);
    //   directbutton.classList.toggle("sidedirect-button-swipebuttoninv", !isEvenIteration);
    // } catch (error) {}
    // iterations++;
  };

  const remove = async (e: any) => {
    if (e.target.tagName == "BUTTON") {
      const wname = e.target.parentElement?.children[0].innerHTML;
      setworkspaces((prevWorkspaces) =>
        prevWorkspaces.filter((workspace) => workspace !== wname)
      );
      dispatch(removeWorkspaceDB({ id: Object_id, wname: wname }));
      //   count--;
      //   let title=e.target.parentElement.children[0].innerHTML?e.target.parentElement.children[0].innerHTML:e.target.parentElement.children[0].name;
      //   axios.post("https://server-gray-omega.vercel.app/workspace",{
      //     email:document.cookie.split("=")[1],
      //     name:document.cookie.split("=")[0],
      //     workspacename:title,
      //     check:1,
      //   })
      //   let switchelem = e.target.parentElement.parentElement.children;
      //   for (let index = 0; index < switchelem.length; index++) {
      //     if (switchelem[index]==e.target.parentElement) {
      //       if (index-1>=0 || switchelem.length==undefined) {
      //         props.changestate(switchelem[index-1].children[0].innerHTML);
      //       }
      //       else if(index+1!=switchelem.length){
      //         props.changestate(switchelem[index+1].children[0].innerHTML);
      //       }
      //       else{
      //         props.changestate("lego batman is awesome")
      //       }
      //     }
      //   }
      //   e.target.parentElement.remove();
    }
  };

  const savetype = async (_e: any) => {
    // if (e.keyCode==13) {
    //   if (e.target.tagName=="INPUT") {
    //     let title=e.target.value;
    //     let workspace_name=e.target;
    //     let name=e.target.name;
    //     let workspace=e.target.parentElement;
    //     workspace_name.remove();
    //     let workspace_newname=document.createElement('div');
    //     axios.post("https://server-gray-omega.vercel.app/workspace",{
    //       email:document.cookie.split("=")[1],
    //       check:2,
    //       workspace_new:title,
    //       workspacename:name
    //     })
    //     workspace_newname.addEventListener('dblclick',edit)
    //     workspace_newname.innerHTML=title;
    //     workspace_newname.name=title;
    //     workspace.prepend(workspace_newname);
    //   }
    // }
  };

  const edit = async (index: number) => {
    console.log(index);
    setdisplayer((prevDisplayWorkspaces: any) => {
      const updatedSpacehandler = [...prevDisplayWorkspaces.spacehandler];
      updatedSpacehandler[index] = !updatedSpacehandler[index];
      return {
        ...prevDisplayWorkspaces,
        spacehandler: updatedSpacehandler,
      };
    });
    // if (e.target.tagName==="DIV") {
    //   let textbox = document.createElement('input');
    //   let workspace_name=e.target;
    //   textbox.type = "text";
    //   textbox.name = workspace_name.name;
    //   textbox.classList.add('workspaceheading');
    //   textbox.addEventListener('keypress',savetype);
    //   workspace_name.parentElement.prepend(textbox);
    //   workspace_name.remove();
    // }
  };

  const changecardspanel = async (_event: any) => {
    // try {
    //   if (event.target.tagName=="DIV") {
    //     let elements = document.getElementsByClassName(event.target.className);
    //     for (let index = 0; index < elements.length; index++) {
    //       elements[index].style.background = "rgba(47, 48, 52, 0)"
    //     }
    //     event.target.style.background = "rgba(96, 89, 89, 0.66)"
    //     let [workspace,title] = [event.target.className=="workspace-group"?event.target.children[0]:event.target,''];
    //     title=workspace.name?workspace.name:workspace.innerHTML;
    //     props.changestate(title)
    //   }
    // } catch (error) {
    // }
  };

  const readwrite = (_name: any, _section: any) => {
    // let workspacetab=document.createElement('div');
    // let text=document.createElement('div');
    // let button=document.createElement('button');
    // let container=section==0?document.getElementsByClassName('workspacehandler')[0]:document.getElementsByClassName('workspacehandler')[1];
    // count++;
    // workspacetab.classList.add('workspace-group');
    // text.name= name;
    // text.addEventListener('dblclick',edit);
    // text.innerHTML = name;
    // button.innerHTML= " -";
    // button.classList.add('.workspace-group');
    // button.classList.add('button');
    // button.addEventListener('click',remove);
    // workspacetab.addEventListener('click',changecardspanel);
    // container.appendChild(workspacetab);
    // workspacetab.appendChild(text);
    // workspacetab.appendChild(button);
  };

  const add = async () => {
    dispatch(
      addWorkspaceDB({ id: Object_id, position: workspaces.length + 1 })
    );
    // if (document.cookie.split("=")[1]) {
    //   let workspacetab=document.createElement('div');
    //   let text=document.createElement('div');
    //   let button=document.createElement('button');
    //   let container=document.getElementsByClassName('workspacehandler')[0];
    //   count++;
    //   workspacetab.classList.add('workspace-group');
    //   text.name=`Workspace ${count}`;
    //   text.addEventListener('dblclick',edit);
    //   text.innerHTML = `Workspace ${count}`
    //   button.innerHTML=" -";
    //   button.classList.add('.workspace-group');
    //   button.classList.add('button');
    //   button.addEventListener('click',remove);
    //   workspacetab.addEventListener('click',changecardspanel);a
    //   container.appendChild(workspacetab);
    //   workspacetab.appendChild(text);
    //   workspacetab.appendChild(button);
    //   axios.post("https://server-gray-omega.vercel.app/workspace",{
    //     email:document.cookie.split("=")[1],
    //     workspacename:text.innerHTML,
    //     check:0,
    //   })
    // }
    // else{
    //   toast.warn('Please Login to your Account')
    // }
  };

  //   const create_group = () =>{
  //     if (document.cookie.split("=")[1]) {
  //       showgroup(true)
  //     }
  //     else{
  //       toast.warn('Please Login to your Account')
  //     }
  //   }

  //   const join_group = () =>{
  //     if (document.cookie.split("=")[1]) {
  //       showjgroup(true)
  //     }
  //     else{
  //       toast.warn('Please Login to your Account')
  //     }
  //   }

  const call_groups = (_event: any) => {
    //   let targeted = event.target;
    //   if (targeted != undefined) {
    //     targeted.classList.toggle("rotatetonifty");
    //     targeted.classList.toggle("rotatetoninty");
    //     document.getElementsByClassName('workspacehandler')[1].style.display === "block"?document.getElementsByClassName('workspacehandler')[1].style.display = "none":document.getElementsByClassName('workspacehandler')[1].style.display = "block";
    //   }
  };

  return (
    <div
      className={`side-container ${
        displayworkspaces.iterations
          ? "side-container-swipeinv"
          : "side-container-swipe"
      }`}
    >
      <div className="nav-direction">
        <button
          className={`sidedirect-button ${
            displayworkspaces.iterations
              ? "sidedirect-button-swipebuttoninv"
              : "sidedirect-button-swipebutton"
          }`}
          onClick={transit}
        >
          <img src={Sideswift} alt="downarrow" />
        </button>
      </div>
      <div className="fixspacelength">
        <div
          className={`workspace-group ${
            displayworkspaces.iterations
              ? "sideopaquetextinv"
              : "sideopaquetext"
          }`}
        >
          Individual &nbsp;&nbsp;
          <button
            onClick={() => {
              setdisplayer({
                ...displayworkspaces,
                ["Individual"]: !displayworkspaces.Individual,
              });
            }}
          >
            <i
              className={`fa-solid fa-caret-down fa-sm ${
                displayworkspaces.Individual ? "rotatetonifty" : "rotatetoninty"
              }`}
              style={{ color: "#ffffff" }}
            ></i>
          </button>
        </div>
        <div
          className={`workspacehandler ${
            displayworkspaces.iterations
              ? "sideopaquetextinv"
              : "sideopaquetext"
          }`}
          style={{ display: displayworkspaces.Individual ? "none" : "block" }}
        >
          {workspaces.map((object: any, index: any) => {
            return (
              <div
                key={index}
                className={`workspace-group ${
                  displayworkspaces.iterations
                    ? "sideopaquetextinv"
                    : "sideopaquetext"
                }`}
              >
                {displayworkspaces.spacehandler[index] ? (
                  <div onDoubleClick={() => edit(index)}>{object}</div>
                ) : (
                  <div onDoubleClick={() => edit(index)}>{"Baka"}</div>
                )}
                <button onClick={remove}>-</button>
              </div>
            );
          })}
        </div>
        <div
          className={`workspace-group ${
            displayworkspaces.iterations
              ? "sideopaquetextinv"
              : "sideopaquetext"
          }`}
        >
          Group &nbsp;&nbsp;
          <button
            onClick={(e) => {
              call_groups(e);
            }}
          >
            <i
              className="fa-solid fa-caret-down fa-sm rotatetonifty"
              style={{ color: "#ffffff" }}
            ></i>
          </button>
        </div>
        <div
          className={`workspacehandler ${
            displayworkspaces.iterations
              ? "sideopaquetextinv"
              : "sideopaquetext"
          }`}
        ></div>
      </div>
      <span className="posdown">
        <div
          className={`workspace-group ${
            displayworkspaces.iterations
              ? "sideopaquetextinv"
              : "sideopaquetext"
          }`}
          id="AddW"
        >
          Add a Workspace &nbsp;&nbsp;&nbsp;<button onClick={add}>+</button>
        </div>
        {/* <div className="group-panel">
          <div className="join-group" style={{borderTop:"1px solid white"}} onClick={create_group}>Create a Group <i className="fa-solid fa-user-group fa-sm"></i></div>
          <div className="join-group" onClick={join_group}>Join a Group <i className="fa-solid fa-users fa-sm"></i></div>
        </div> */}
      </span>
      {/* {group && <Group boarddisplay={showgroup} edit={edit} remove={remove} changecardspanel={changecardspanel} />}
      {jgroup && <JoinG boarddisplay={showjgroup} edit={edit} remove={remove} changecardspanel={changecardspanel} />} */}
      {/* <ToastContainer
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
        transition={Bounce}
      /> */}
    </div>
  );
}

export default Sidepanel;
