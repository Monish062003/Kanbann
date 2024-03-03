import React,{useState,useEffect} from 'react'
import '../Css/card.css'
import Delete from "../Images/delete.png";
import Tasksection from '../components/tasksection'
import axios from "axios"

export default function Card(props) {
  let deletebtn = (async () => {
    let cardsarray = [];
    let changestate= props.changestate;
    let carry=0;

    let data = axios.post("https://serverhost-rho.vercel.app/readworkspace",{
      email: document.cookie.split("=")[1],
      workspace:props.current_workspace,
      check:1
    })
    data = await data;
    data = data['data'];
    
    let finalindex= data.length/4;
    
    for (let index = 0; index < finalindex; index++) {
      if (props.name == data[index]) {
        carry = index;
      }
    }
    data.splice(carry,1)
    data.splice(carry+finalindex-1,1)
    data.splice(carry+2*finalindex-2,1)
    data.splice(carry+3*finalindex-3,1)
    
    finalindex= data.length/4;
    carry=0;
    for (let index = 0; index < finalindex; index++) {
      if (typeof data[index-1+3*finalindex] == 'object') {
        carry+=data[index-1+3*finalindex].length
      }
      cardsarray.push(<Card name={data[index]} title={data[index+finalindex]} desc={data[index+2*finalindex]} tasks={data[index+3*finalindex]} beforetaskslength={carry} changestate={changestate} arrange={index} current_workspace={props.current_workspace}/>)
    }
    changestate([...cardsarray])      
    
    axios.post("https://serverhost-rho.vercel.app/card",{
      email: document.cookie.split("=")[1],
      active_workspace: props.current_workspace,
      cardname: props.name,
      check: 1,
    })

    })
    let refreshstopper=0;
    
    const[tasks, setTasks]=useState([])

    useEffect(() => {
      if (props.tasks!=null) {
        (async()=>{
          if (refreshstopper==0) {
            let data = await props.tasks;
            let tasksArray = [];
            for (let index = 0; index < data.length; index++) {
              tasksArray.push(<Tasksection cardname={props.name} title={props.title} value={data[index]} beforetaskslength={props.beforetaskslength} taskarrange={index} current_workspace={props.current_workspace} changingstate={setTasks}/>)
            }
            setTasks([...tasksArray])
            let elements = document.getElementsByClassName('card');
            elements[props.arrange].children[0].children[0].innerHTML=props.title;
            elements[props.arrange].children[1].children[0].innerHTML=props.desc;
            refreshstopper++;
          }    
        })()
      }
    }, [props.tasks])
    
    let AddTask=(async()=>{
      let tdata = axios.post("https://serverhost-rho.vercel.app/task",{
        email:document.cookie.split("=")[1],
        card_name:props.name,
        task: `Task ${tasks.length+1}`,
        check:0,
        workspace:props.current_workspace
      })
      
      tdata = await tdata
      tdata = tdata['data']
      setTasks([...tasks, <Tasksection cardname={props.name} title={props.title} beforetaskslength={parseInt(tdata)} taskarrange={parseInt(tasks.length)} value={`Task ${tasks.length+1}`} changingstate={setTasks} current_workspace={props.current_workspace}/>]);
    });

    let savetype=(async(event)=>{
      if (event.keyCode==13) {
        let newtitle=event.target.value;
        let parent=event.target.parentElement;
        let div=document.createElement('div');
        let locate = 0;
        if (parent.className=='cardtitle') {
          div.classList.add('ctitle');
          locate = 1;
        }
        else{
          div.classList.add('cdesc');
          locate = 2;
        }
        
        axios.post("https://serverhost-rho.vercel.app/card",{
          email:document.cookie.split("=")[1],
          change: newtitle,
          cardname: props.name,
          check:2,
          locate:locate
        })

        div.innerHTML=newtitle;
        div.addEventListener('dblclick',changetitle);
        event.target.remove();
        parent.prepend(div);
      }
    });
      
    let changetitle=((event)=>{
      let parent=event.target.parentElement;
      let input=document.createElement('input');
      input.name=event.target.innerHTML;
      input.classList.add('ctitleinpu');
      input.addEventListener('keypress',savetype);
      event.target.remove();
      parent.prepend(input);
    });
    
  return (
    <div>
      <div className="card" name={props.name}>
        <div className="cardtitle">
            <div className="ctitle" onDoubleClick={changetitle}></div>
            <img src={Delete} alt="delete" onClick={deletebtn}/>
        </div>
        <div className="carddesc">
            <div className="cdesc" onDoubleClick={changetitle}></div>
        </div>
        <div className="line"></div>
        <div className="carddatacontainer">
          <div className="cdatapanel">
            {tasks.map((task, index) => (
              <div key={index}>{task}</div>
            ))}
          </div>
          <div className="taskadd"><button onClick={AddTask}>Add a Task</button></div>
        </div>
      </div>
    </div>
  )
}