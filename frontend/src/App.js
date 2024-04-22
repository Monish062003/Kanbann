import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Boardpage from './components/boardpage';
import JGroup from './components/JoinG';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Boardpage/>}/>
            <Route path='/group' element={<JGroup/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
