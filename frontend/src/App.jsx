import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Homepage from './components/Homepage.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

const Poetry = () => <div><h1>Poetry Category</h1></div>
const Humor = () => <div><h1>Humor Category</h1></div>
const Action = () => <div><h1>Action Category</h1></div>

function App() {
 return (
  <Router>
    <Routes>
      {/* The homepage route */}
      <Route path="/" element={<Homepage />} />

      <Route path='login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  </Router>
);
}

export default App