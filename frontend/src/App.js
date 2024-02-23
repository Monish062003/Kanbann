import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Boardpage from './components/boardpage';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Boardpage/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
