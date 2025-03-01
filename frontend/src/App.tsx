// import { useState } from 'react'
import { HashRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Startpage from './Startpage';

function App() {


  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Startpage />} />
        </Routes>

      </div>

    </HashRouter>
  )


}

export default App
