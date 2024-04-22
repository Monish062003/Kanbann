import React,{useRef,useEffect, useState} from 'react'
import '../Css/card.css'
import axios from "axios"

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
        elements[parseInt(props.beforetaskslength)+parseInt(props.taskarrange)].children[0].placeholder=props.value;
        refreshstopper++;
      }
    } catch (error) {
      
    }
  },[props.value])
  const inputvalue = useRef("");

  let TaskButton=(async()=>{
    let changestate = props.changingstate;
    let count=localStorage.getItem('count');
    
    let tdata =  axios.post("http://localhost:80/task",{
      email:document.cookie.split("=")[1],
      card_name:props.cardname,
      workspace:props.current_workspace,
      task:props.value,
      check:1,
    }) 

    tdata = await tdata;
    tdata = tdata['data']
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
      inputvalue.current.placeholder=newvalue;
      axios.post("http://localhost:80/task",{
        email:document.cookie.split("=")[1],
        card_name:props.cardname,
        workspace:props.current_workspace,
        task:oldvalue,
        newvalue:newvalue,
        check:2,
      }) 
    }
  }

  return (
    <div className='list' style={{display:"flex",paddingBottom:"2vh"}}>
      <textarea className="form-control" value={taskdata} onChange={onChangeListener} onKeyUp={onChangeListener} ref={inputvalue} onKeyDown={savetype} ></textarea>
      <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={TaskButton}>Remove</button>
    </div>
  )
}
