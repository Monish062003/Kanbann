import React, { useState, useEffect, useMemo } from 'react';
import '../Css/boardpage.css';
import Navbar from './Navbar.jsx';
import Cardspanel from './cardpanel';
import Sidepanel from './sidepanel';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import { Slide } from 'react-toastify';

async function fetchWorkspaceData() {
  if (document.cookie.split("=")[1]!=undefined) {
    const response = axios.post("https://server-gray-omega.vercel.app/email",{
      "email": `${document.cookie.split("=")[1]}`,
    })

    const data = (await response).data;
    return data;
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

  const [gdata, getgdata] = useState({
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
        let groupintegrated_data=[[],[{cards_name:[],cards_desc:[],cards_title:[]}],[]]
        const[individual,group]=[temp!=null?temp.individual:null,temp!=null?temp.group:null]
        if (group != null) {
          for (let index = 0; index < groupintegrated_data.length; index++) {
            switch (index) {
              case 0:
                group.forEach(data => {
                  groupintegrated_data[index].push(data.workspaces[0])
                });
                break;
              
              case 1:
                let [cards_name,cards_desc,cards_title] = [[],[],[]];
                let cardstring = ['cards_name','cards_desc','cards_title']
                group.forEach(data => {
                  cardstring.forEach(cstring => {
                    data.cards[cstring].forEach(element => {
                      switch (cstring) {
                        case 'cards_name':
                          cards_name.push(element)
                          break;
  
                        case 'cards_desc':
                          cards_desc.push(element)
                          break;
  
                        case 'cards_title':
                          cards_title.push(element)
                          break;
                      }
                    });
                  });
                  groupintegrated_data[1].cards_name = cards_name
                  groupintegrated_data[1].cards_desc = cards_desc
                  groupintegrated_data[1].cards_title = cards_title
                });
                break;
            }
          }
        }
        else{
          groupintegrated_data[1].cards_name = null
          groupintegrated_data[1].cards_desc = null
          groupintegrated_data[1].cards_title = null
        }

        if (group != null) {
          group.forEach(gelement => {
            getgdata({...gdata,
              ['workspaces']:groupintegrated_data[0]||null,
              ['cards']:groupintegrated_data[1]||null,
              ['tasks']:gelement?.tasks||null
            })
          });
        }
        else{
          getgdata({...gdata,
            ['workspaces']:groupintegrated_data[0]||null,
            ['cards']:groupintegrated_data[1]||null,
            ['tasks']:null
          })
        }
        getdata({...data,
          ['workspaces']:individual?.workspaces||null,
          ['cards']:individual?.cards||null,
          ['tasks']:individual?.tasks||null
        })
        new_workspace(individual?.workspaces[0]||null); 
      })();
    }
    refreshstopper++;
  }, [fetchWorkspaceData]); 

  const memoizedSidepanel = useMemo(() => (
    <Sidepanel data={data.workspaces} gdata={gdata.workspaces} changestate={new_workspace} sender={set_card}/>
  ), [data.workspaces]);

  return (
    <div>
      <Navbar/>
      <div className="home">
        {memoizedSidepanel}
        <Cardspanel data={data.cards} gdata={gdata.cards} taskdata={data.tasks} current_workspace={workspace_active} receiver={cards_add} sender={set_card}/>
      </div>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition= {Slide}
        />
    </div>
  );
}

export default Boardpage;
