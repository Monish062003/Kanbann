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
  updateWorkspaceDB,
} from "../Slicers/slice";
import { stat } from "fs";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Bounce } from "react-toastify";
// import "animate.css";

function Sidepanel() {
  let totalbooleans: any = [[], []];
  const [workspaces, setworkspaces] = useState<string[]>([]);
  const [displayworkspaces, setdisplayer] = useState({
    Individual: true,
    Group: false,
    iterations: true,
    spacehandler: [],
    inputhandler: [],
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
    const topLevelKeys = data.map(
      (workspace: any) => Object.keys(workspace)[0]
    );
    setworkspaces(topLevelKeys);

    for (let index = 0; index < topLevelKeys.length; index++) {
      totalbooleans[0].push(true);
      totalbooleans[1].push("");
    }

    setdisplayer((prevDisplayWorkspaces) => ({
      ...prevDisplayWorkspaces,
      spacehandler: totalbooleans[0],
      inputhandler: totalbooleans[1],
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
  };

  const remove = async (event: any, index: number) => {
    if (event.target.tagName == "BUTTON") {
      const wname = event.target.parentElement?.children[0].innerHTML;
      setworkspaces((prevWorkspaces) =>
        prevWorkspaces.filter((workspace) => workspace !== wname)
      );
      dispatch(
        removeWorkspaceDB({
          id: Object_id,
          wname: wname,
          w_index: index,
        })
      );
    }
  };

  const edit = async (event: any, index: number) => {
    if (event.target.tagName === "INPUT" && event.key !== "Enter") {
      setdisplayer((prevDisplayWorkspaces) => {
        const updatedInputhandler: any = [
          ...prevDisplayWorkspaces.inputhandler,
        ];
        updatedInputhandler[index] = event.target.value;
        return {
          ...prevDisplayWorkspaces,
          inputhandler: updatedInputhandler,
        };
      });
    } else if (event.key === "Enter" || event.target.tagName === "DIV") {
      if (event.key === "Enter")
        dispatch(
          updateWorkspaceDB({
            id: Object_id,
            w_index: index,
            newname: event.target.value,
            oldname: event.target.name,
          })
        );
      setdisplayer((prevDisplayWorkspaces: any) => {
        const updatedSpacehandler = [...prevDisplayWorkspaces.spacehandler];
        updatedSpacehandler[index] = !updatedSpacehandler[index];
        return {
          ...prevDisplayWorkspaces,
          spacehandler: updatedSpacehandler,
        };
      });
    }
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

  const add = async () => {
    dispatch(addWorkspaceDB({ id: Object_id }));
    // if (document.cookie.split("=")[1]) {
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
                  <div onDoubleClick={(event) => edit(event, index)}>
                    {object}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="text-black"
                    name={object}
                    value={displayworkspaces.inputhandler[index]}
                    onChange={(event) => edit(event, index)}
                    onKeyDown={(event) => edit(event, index)}
                  ></input>
                )}
                <button onClick={(event) => remove(event, index)}>-</button>
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
