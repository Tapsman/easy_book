import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Homepage from './Homepage';
import 'App.css';

const Poetry = () => <div><h1>Poetry Category</h1></div>
const Humor = () => <div><h1>Humor Category</h1></div>
const Action = () => <div><h1>Action Category</h1></div>

function App() {
  const [showLogin, setShowLogin] = useState(false); 
  const [showSignUp, setShowSignUp] = useState(false);
    const handleLoginClick = () =>  {
      setShowLogin(true);
      setShowSignUp(false); /* It then hides signup if login is clicked */
    };
  
    const handleSignUpClick = () => {
      setShowSignUp(true);
      setShowLogin(false); /* Hides signup if login is clicked */
    };
 return (
  <Router>
    <Routes>
      {/* The homepage route */}
      <Route path="/" element={<Homepage />} />
      {/* Catagory routes */}
      <Route path="/poetry" element={<poetry />} />
      <Route path="/humor" element={<humor />} />
      <Route path="/action" element={<action />} />
    </Routes>
  </Router>
);
}

export default App