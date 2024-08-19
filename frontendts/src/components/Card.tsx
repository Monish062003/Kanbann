import React, { useState, useEffect } from "react";
import "../Css/card.scss";
import Delete from "../Images/delete.png";
// import Tasksection from "../components/tasksection";
import { removeCardDB, updateCardDB } from "../Slicers/card_slice";
import { addTaskDB, removeTaskDB, updateTaskDB } from "../Slicers/task_slice";

export default function Card(props: any) {
  const dispatch = props.dispatch;
  const [elementCardState, setelementalCardState] = useState({
    card_title: true,
    card_description: true,
  });
  const [taskElementalState, settaskElementalState] = useState({
    spacehandler: [],
    inputhandler: [],
  });
  const Object_id = props.Object_id;
  let deleteCard = async () => {
    dispatch(
      removeCardDB({
        id: Object_id,
        card_index: props.card_index,
        workspace_index: props.workspace[0],
        workspace_name: props.workspace[1],
      })
    );
  };

  useEffect(() => {
    const totalbooleans: any = [[], []];
    props.tasks.map((task: any) => {
      totalbooleans[0].push(true);
      totalbooleans[1].push(Object.keys(task)[0]);
      return Object.keys(task)[0];
    });

    totalbooleans[0].pop();
    totalbooleans[1].pop();

    settaskElementalState({
      ...taskElementalState,
      ["inputhandler"]: totalbooleans[1],
      ["spacehandler"]: totalbooleans[0],
    });
  }, [props.tasks]);

  let AddTask = async () => {
    dispatch(
      addTaskDB({
        id: Object_id,
        card_index: props.card_index,
        workspace_index: props.workspace[0],
        workspace_name: props.workspace[1],
        card_name: props.title,
        task_index: taskElementalState.inputhandler.length,
      })
    );
  };

  let removeTask = (index: number) => {
    dispatch(
      removeTaskDB({
        id: Object_id,
        card_index: props.card_index,
        workspace_index: props.workspace[0],
        workspace_name: props.workspace[1],
        card_name: props.title,
        task_index: index,
      })
    );
  };

  const onTaskChangeListener = (event: any, index: number) => {
    settaskElementalState((prevDisplayTasks) => {
      const updatedInputhandler: any = [...prevDisplayTasks.inputhandler];
      updatedInputhandler[index] = event.target.value;
      return {
        ...prevDisplayTasks,
        inputhandler: updatedInputhandler,
      };
    });
  };

  let updateTask = (event: any, index: number) => {
    if (event.key === "Enter") {
      dispatch(
        updateTaskDB({
          id: Object_id,
          card_index: props.card_index,
          workspace_index: props.workspace[0],
          workspace_name: props.workspace[1],
          card_name: props.title,
          task_index: index,
          newname: event.target.value,
        })
      );
    }
  };

  let saveCardType = async (event: any, element: string) => {
    if (event.keyCode == 13) {
      element === "card_title"
        ? setelementalCardState({
            ...elementCardState,
            ["card_title"]: !elementCardState.card_title,
          })
        : setelementalCardState({
            ...elementCardState,
            ["card_description"]: !elementCardState.card_description,
          });
      dispatch(
        updateCardDB({
          id: Object_id,
          card_index: props.card_index,
          workspace_index: props.workspace[0],
          workspace_name: props.workspace[1],
          oldname: event.target.name,
          newname: event.target.value,
          target: element,
        })
      );
    }
  };

  return (
    <div>
      <div className="card">
        <div className="cardtitle">
          {elementCardState.card_title ? (
            <div
              className="ctitle"
              onDoubleClick={() =>
                setelementalCardState({
                  ...elementCardState,
                  ["card_title"]: !elementCardState.card_title,
                })
              }
            >
              {props.title}
            </div>
          ) : (
            <input
              type="text"
              className="ctitleinpu"
              name={props.title}
              onKeyDown={(event) => saveCardType(event, "card_title")}
            ></input>
          )}
          <img src={Delete} alt="delete" onClick={deleteCard} />
        </div>
        <div className="carddesc">
          {elementCardState.card_description ? (
            <div
              className="cdesc"
              onDoubleClick={() =>
                setelementalCardState({
                  ...elementCardState,
                  ["card_description"]: !elementCardState.card_description,
                })
              }
            >
              {props.desc}
            </div>
          ) : (
            <input
              type="text"
              className="ctitleinpu"
              name={props.desc}
              onKeyDown={(event) => saveCardType(event, "card_description")}
            ></input>
          )}
        </div>
        <div className="line"></div>
        <div className="carddatacontainer">
          <div className="cdatapanel">
            {taskElementalState.inputhandler.map((task, index) => (
              <div key={index}>
                {taskElementalState.spacehandler ? (
                  <div
                    className="list"
                    style={{ display: "flex", paddingBottom: "2vh" }}
                  >
                    <textarea
                      className="form-control"
                      value={task}
                      onChange={(event: any) =>
                        onTaskChangeListener(event, index)
                      }
                      onKeyDown={(event: any) => updateTask(event, index)}
                    ></textarea>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      id="button-addon2"
                      onClick={() => removeTask(index)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
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
