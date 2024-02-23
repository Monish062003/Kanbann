import React,{useEffect,useState,useRef} from 'react';
import '../Css/card.css';
import Card from './card';
import Cookies from 'js-cookie';

function Cardpanel(props) {

  const[cards, setCards]=useState([])
  const[name,setname]=useState();
  const [count, setCount] = useState(parseInt(Cookies.get('count')?parseInt(Cookies.get('count'))+1:0));
  let refreshstopper = 0;

  useEffect(()=>{
    if (refreshstopper==0) {
      if (document.cookie.split("=")[0] != "id" && document.cookie.split("=")[1]) {
        setname(`Hello ${document.cookie.split("=")[0]}`);
        if (count==0) {
          document.cookie=`count=${count}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path="/"`;
        }
    }
  
    (async()=>{
      if (props.current_workspace!=null) {
        let cardsArray=[];
        let getcardsinfo = await fetch("/readworkspace", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: document.cookie.split("=")[1],
            workspace:props.current_workspace,
            check:1
          })
        });
        let newdata = await getcardsinfo.json();
        let finalindex= newdata.length/4;
        if (finalindex != undefined) {
          let [figure,carry] = [[0],0]
          for (let index = 0; index < finalindex; index++) {
            if (index != 0) {
              carry+=newdata[[index+3*finalindex]-1].length
              figure.push(carry)
            }
            cardsArray.push(<Card name={newdata[index]} title={newdata[index+finalindex]} desc={newdata[index+2*finalindex]} tasks={newdata[index+3*finalindex]} beforetaskslength={figure[index]} usingstate={cards} changestate={setCards} arrange={index} current_workspace={props.current_workspace}/>)
          }
          setCards([...cardsArray]);
        }
      }
      else if(props.current_workspace=="lego batman is awesome"){
        setCards([]);
      }
    })()
    }
    refreshstopper++;
  },[props.current_workspace])

  useEffect(()=>{
    if (props.receiver==true) {
      AddCard()
    }
  },[props.receiver])

  const AddCard=(()=>{
    let carry = 0
    for (let index = 0; index < cards.length; index++) {
      carry+=cards[index].props.tasks.length;
    }
    setCount(count + 1);
    document.cookie=`count=${count} ; expires=Fri, 31 Dec 9999 23:59:59 GMT; path="/"`
    setCards([...cards,<Card name={`Card ${count}`} title={'Card Title'} desc={'Card Description'} tasks={['Task 1']} beforetaskslength={carry} arrange={cards.length} current_workspace={props.current_workspace} usingstate={cards} changestate={setCards}/>])
    fetch('/card',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email:document.cookie.split("=")[1],
        active_workspace:props.current_workspace,
        cardtitle: 'Card Title',
        cardname: `Card ${count}`,
        carddesc: 'Card Description',
        check:0,
        position: cards.length
      })
    })
  });

  return (
    <div className='card-container'>
      <div className="emaildisplay">
        {name}
      </div>
      <button className='addcardbtn' onClick={AddCard}>Add a Card</button>
      <div className="innercontainer">
        {cards.map((card, index) => (
          <div className='stylediv' key={index}>{card}</div>
        ))}
      </div>
    </div>
  )
}

export default Cardpanel
