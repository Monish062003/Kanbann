import React,{useRef,useEffect, useState} from 'react'
import '../Css/card.css'

export default function Tasksection(props) {

  const [taskdata,changetaskdata] = useState([])
  let refreshstopper = 0;

  const onChangeListener = (event) =>{
    const newValue = event.keyCode === 13 ? '' : event.target.value;
    changetaskdata(newValue);
  }

  useEffect(()=>{
    try {
      if (refreshstopper==0) {
        let elements = document.getElementsByClassName('list');
        elements[props.beforetaskslength+props.taskarrange].children[0].children[0].placeholder=props.value;
        refreshstopper++;
      }
    } catch (error) {
      
    }
  },[props.value])
  const inputvalue = useRef("");

  let TaskButton=(async()=>{
    let changestate = props.changingstate;
    let count=localStorage.getItem('count');
    let tdata = await fetch("/task",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email:document.cookie.split("=")[1],
        card_name:props.cardname,
        workspace:props.current_workspace,
        task:props.value,
        check:1,
      })
    })

    tdata = await tdata.json();
    for (let index = 0; index < tdata.length; index++) {
      if (tdata[index]==props.value) {
        tdata.splice(index,1)
      }
    }

    let tasksArray = []
    for (let index = 0; index < tdata.length; index++) {
      tasksArray.push(<Tasksection cardname={props.cardname} value={tdata[index]} beforetaskslength={props.beforetaskslength} taskarrange={index} current_workspace={props.current_workspace} changingstate={changestate}/>)
    }
    try {
      changestate([...tasksArray])
    } catch (error) {
      
    }

    localStorage.setItem('count',--count)
  })

  const savetype = async(event)=>{
    if (event.key === 'Enter') {
      let [oldvalue,newvalue] = [inputvalue.current.placeholder,inputvalue.current.value];
      console.log(oldvalue,newvalue)
      inputvalue.current.placeholder=newvalue;
      fetch("/task",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email:document.cookie.split("=")[1],
          card_name:props.cardname,
          workspace:props.current_workspace,
          task:oldvalue,
          newvalue:newvalue,
          check:2,
        })
      })
    }
  }

  return (
    <div className='list'>
      <div className="input-group mb-3" draggable="true">
        <input type="text" className="form-control" value={taskdata} onChange={onChangeListener} onKeyUp={onChangeListener} ref={inputvalue} aria-label="Recipient's username" aria-describedby="button-addon2" onKeyDown={savetype}/>
        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={TaskButton}>Remove</button>
      </div>
    </div>
  )
}
