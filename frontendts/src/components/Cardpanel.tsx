import React, { useEffect, useState, useRef } from "react";
import "../Css/card.scss";
import Card from "./Card";
// import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addCardDB } from "../Slicers/card_slice";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Bounce } from "react-toastify";

function Cardpanel() {
  const [cards, setCards] = useState([]);
  const [name, setname] = useState();
  const [count, setCount] = useState();
  const data = useSelector((state: any) => state.user_data_reducer.data);
  const dispatch = useDispatch();
  const current_workspace = useSelector(
    (state: any) => state.user_data_reducer.currentWorkspace
  );
  // parseInt(Cookies.get("count") ? parseInt(Cookies.get("count")) + 1 : 1)
  const Object_id = useSelector(
    (state: any) => state.user_data_reducer.Object_id
  );

  const AddCard = async () => {
    dispatch(
      addCardDB({
        id: Object_id,
        workspace_name: Object.keys(data[current_workspace])[0],
        workspace_index: current_workspace,
      })
    );
    // if (document.cookie.split("=")[1]) {
    //   let [carry, date] = [0, new Date()];
    //   let dates = [
    //     date.getDate(),
    //     date.getMonth() + 1,
    //     date.getFullYear(),
    //     date.getHours(),
    //     date.getMinutes(),
    //   ];
    //   for (let index = 0; index < cards.length; index++) {
    //     carry += cards[index].props.tasks.length;
    //   }
    //   setCount(count + 1);
    //   document.cookie = `count=${count} ; expires=Fri, 31 Dec 9999 23:59:59 GMT; path="/"`;
    //   let response = await axios.post(
    //     "https://server-gray-omega.vercel.app/card",
    //     {
    //       email: document.cookie.split("=")[1],
    //       active_workspace: props.current_workspace,
    //       cardtitle: "Card Title",
    //       cardname: `Card ${count}`,
    //       carddesc: "Card Description",
    //       check: 0,
    //       position: cards.length,
    //       dates: dates,
    //     }
    //   );
    //   response = parseInt(response["data"]);
    //   setCards([
    //     ...cards,
    // <Card
    //   name={`Card ${count}`}
    //   title={"Card Title"}
    //   desc={"Card Description"}
    //   tasks={["Task 1"]}
    //   beforetaskslength={response}
    //   arrange={cards.length}
    //   current_workspace={props.current_workspace}
    //   usingstate={cards}
    //   changestate={setCards}
    // />,
    //   ]);
    // } else {
    //   toast.warn("Please Login to your Account");
    // }
  };

  useEffect(() => {
    try {
      if (data.length !== 0 && current_workspace !== null) {
        setCards(
          data[current_workspace][Object.keys(data[current_workspace])[0]]
        );
      }
    } catch (error) {
      // if (current_workspace - 1 > 0) {
      //   setCards(
      //     data[current_workspace - 1][
      //       Object.keys(data[current_workspace - 1])[0]
      //     ]
      //   );
      // }
    }
  }, [current_workspace, AddCard, data]);

  // useEffect(() => {
  //   if (refreshstopper == 0) {
  //     if (
  //       document.cookie.split("=")[0] != "id" &&
  //       document.cookie.split("=")[1]
  //     ) {
  //       setname(`Hello ${document.cookie.split("=")[0]}`);
  //       if (count == 1) {
  //         document.cookie = `count=${count}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path="/"`;
  //       }
  //     }

  //     (async () => {
  //       if (props.current_workspace != null) {
  //         let cardsArray = [];
  //         let getcardsinfo = axios.post(
  //           "https://server-gray-omega.vercel.app/readworkspace",
  //           {
  //             email: document.cookie.split("=")[1],
  //             workspace: props.current_workspace,
  //             check: 1,
  //           }
  //         );
  //         let newdata = await getcardsinfo;
  //         const section = newdata["data"].section;
  //         newdata = newdata["data"].arrays;
  //         let finalindex = newdata.length / 4;
  //         if (finalindex != undefined) {
  //           let [figure, carry] = [[0], 0];
  //           for (let index = 0; index < finalindex; index++) {
  //             if (index != 0) {
  //               carry += newdata[[index + 3 * finalindex] - 1].length;
  //               figure.push(carry);
  //             }
  //             cardsArray.push(
  //               <Card
  //                 name={newdata[index]}
  //                 title={newdata[index + finalindex]}
  //                 desc={newdata[index + 2 * finalindex]}
  //                 tasks={newdata[index + 3 * finalindex]}
  //                 beforetaskslength={figure[index]}
  //                 usingstate={cards}
  //                 changestate={setCards}
  //                 arrange={index}
  //                 current_workspace={props.current_workspace}
  //                 section={section}
  //               />
  //             );
  //           }
  //           setCards([...cardsArray]);
  //         }
  //       } else if (props.current_workspace == "lego batman is awesome") {
  //         setCards([]);
  //       }
  //     })();
  //   }
  //   refreshstopper++;
  // }, [props.current_workspace]);

  // useEffect(() => {
  //   if (props.receiver == true) {
  //     AddCard();
  //   }
  // }, [props.receiver]);

  return (
    <div className="card-container">
      <div className="emaildisplay">{name}</div>
      <button className="addcardbtn" onClick={AddCard}>
        Add a Card
      </button>
      <div className="innercontainer">
        {cards.map((card: any, index) => {
          return (
            <div className="stylediv" key={index}>
              {current_workspace !== null && (
                <Card
                  title={Object.keys(card)[0]}
                  desc={
                    card[Object.keys(card)[0]][
                      card[Object.keys(card)[0]].length - 1
                    ]
                  }
                  tasks={card[Object.keys(card)[0]]}
                  workspace={[
                    current_workspace,
                    Object.keys(data?.[current_workspace])[0],
                  ]}
                  usingstate={cards}
                  changestate={setCards}
                  card_index={index}
                  dispatch={dispatch}
                  Object_id={Object_id}
                />
              )}
            </div>
          );
        })}
      </div>
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

export default Cardpanel;
