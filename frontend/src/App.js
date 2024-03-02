import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Boardpage from './components/boardpage';
import Pikachu from './components/Pikachu';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Boardpage/>}/>
            <Route path='/Pikachu' element={<Pikachu/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
