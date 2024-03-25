import React, { useState, useEffect, useMemo } from 'react';
import '../Css/boardpage.css';
import Navbar from './Navbar.jsx';
import Cardspanel from './cardpanel';
import Sidepanel from './sidepanel';
import axios from "axios"

async function fetchWorkspaceData() {
  if (document.cookie.split("=")[1]!=undefined) {
    const response = axios.post("http://localhost:80/email",{
      "email": `${document.cookie.split("=")[1]}`,
    })

    let data = await response;
    return data['data'];
  }
  else{
    return null;
  }
}

function Boardpage() {
  let refreshstopper = 0;
  const [data, getdata] = useState({
    workspaces:null,
    cards:null,
    tasks:null,
  });

  const[workspace_active,new_workspace]=useState(null);
  const[cards_add,set_card]=useState(false);
  
  useEffect(() => {
    if (refreshstopper==0) {
      (async () => {
        const temp = await fetchWorkspaceData();
        getdata({...data,
          ['workspaces']:temp?.workspaces||null,
          ['cards']:temp?.cards||null,
          ['tasks']:temp?.tasks||null
        })
        new_workspace(temp?.workspaces[0]||null); 
      })();
    }
    refreshstopper++;
  }, [fetchWorkspaceData]); 

  const memoizedSidepanel = useMemo(() => (
    <Sidepanel data={data.workspaces} changestate={new_workspace} sender={set_card}/>
  ), [data.workspaces]);

  return (
    <div>
      <Navbar/>
      <div className="home">
        {memoizedSidepanel}
        <Cardspanel data={data.cards} taskdata={data.tasks} current_workspace={workspace_active} receiver={cards_add} sender={set_card}/>
      </div>
    </div>
  );
}

export default Boardpage;
