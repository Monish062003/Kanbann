import React, { useState, useEffect } from "react";
import "../Css/card.scss";
import Delete from "../Images/delete.png";
// import Tasksection from "../components/tasksection";
import axios from "axios";
import { removeCardDB, updateCardDB } from "../Slicers/card_slice";

export default function Card(props: any) {
  const dispatch = props.dispatch;
  const [elementstate, setelementalstate] = useState(true);
  let deletebtn = async () => {
    dispatch(
      removeCardDB({
        id: props.Object_id,
        card_index: props.card_index,
        workspace_index: props.workspace[0],
        workspace_name: props.workspace[1],
      })
    );
  };
  let refreshstopper = 0;

  const [tasks, setTasks] = useState([]);

  // useEffect(() => {
  //   if (props.tasks != null) {
  //     (async () => {
  //       if (refreshstopper == 0) {
  //         let data = await props.tasks;
  //         let tasksArray = [];
  //         for (let index = 0; index < data.length; index++) {
  //           tasksArray.push(
  //             <Tasksection
  //               cardname={props.name}
  //               title={props.title}
  //               value={data[index]}
  //               beforetaskslength={props.beforetaskslength}
  //               taskarrange={index}
  //               current_workspace={props.current_workspace}
  //               changingstate={setTasks}
  //             />
  //           );
  //         }
  //         setTasks([...tasksArray]);
  //         let elements = document.getElementsByClassName("card");
  //         elements[props.arrange].children[0].children[0].innerHTML =
  //           props.title;
  //         elements[props.arrange].children[1].children[0].innerHTML =
  //           props.desc;
  //         refreshstopper++;
  //       }
  //     })();
  //   }
  // }, [props.tasks]);

  let AddTask = async () => {
    // let tdata = axios.post("https://server-gray-omega.vercel.app/task", {
    //   email: document.cookie.split("=")[1],
    //   card_name: props.name,
    //   task: `Task ${tasks.length + 1}`,
    //   check: 0,
    //   workspace: props.current_workspace,
    // });
    // tdata = await tdata;
    // tdata = tdata["data"];
    // setTasks([
    //   ...tasks,
    //   <Tasksection
    //     cardname={props.name}
    //     title={props.title}
    //     beforetaskslength={parseInt(tdata)}
    //     taskarrange={0}
    //     value={`Task ${tasks.length + 1}`}
    //     changingstate={setTasks}
    //     current_workspace={props.current_workspace}
    //   />,
    // ]);
  };

  let savetype = async (event: any) => {
    if (event.keyCode == 13) {
      setelementalstate(!elementstate);
      dispatch(
        updateCardDB({
          id: props.Object_id,
          card_index: props.card_index,
          workspace_index: props.workspace[0],
          workspace_name: props.workspace[1],
          oldname: event.target.name,
          newname: event.target.value,
        })
      );
    }
  };

  return (
    <div>
      <div className="card">
        <div className="cardtitle">
          {elementstate ? (
            <div
              className="ctitle"
              onDoubleClick={() => setelementalstate(!elementstate)}
            >
              {props.title}
            </div>
          ) : (
            <input
              type="text"
              className="ctitleinpu"
              name={props.title}
              onKeyDown={(event) => savetype(event)}
            ></input>
          )}
          <img src={Delete} alt="delete" onClick={deletebtn} />
        </div>
        <div className="carddesc">
          <div
            className="cdesc"
            onDoubleClick={() => setelementalstate(!elementstate)}
          >
            {props.desc}
          </div>
        </div>
        <div className="line"></div>
        <div className="carddatacontainer">
          <div className="cdatapanel">
            {tasks.map((task, index) => (
              <div key={index}>{task}</div>
            ))}
          </div>
          <div className="taskadd">
            <button onClick={AddTask}>Add a Task</button>
          </div>
        </div>
      </div>
    </div>
  );
}
