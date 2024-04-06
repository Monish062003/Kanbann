import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Boardpage from './components/boardpage';
import Group from './components/Group';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Boardpage/>}/>
            <Route path='/group' element={<Group/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
