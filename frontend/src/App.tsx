// import { useState } from 'react'
import { HashRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Startpage from './Startpage';
import Gamepage from './Gamepage';
import Endpage from './Endpage';
import Initpage from './Initpage'

function App() {


  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Startpage />} />
        </Routes>
        <Routes>
          <Route path="/game" element={<Gamepage />} />
        </Routes>
        <Routes>
          <Route path="/end" element={<Endpage />} />
        </Routes>
        <Routes>
          <Route path="/init" element={<Initpage />} />
        </Routes>

      </div>

    </HashRouter>
  )


}

export default App
