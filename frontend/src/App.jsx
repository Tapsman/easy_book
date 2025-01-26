import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Homepage from './components/Homepage.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Books from './components/books/books.jsx';
import AddBook from './components/books/AddBook';
import UpdateBook from './components/books/UpdateBook.jsx';
import BookDetail from './components/books/BookDetail.jsx';
import UpdateUser from './components/users/UpdateUser.jsx';
import ListUsers from './components/users/ListUsers.jsx';

function App() {
 return (
  <Router>
    <Routes>
      
      <Route path="/" element={<Homepage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/books' element={<Books/>}/>
      <Route path='/books/add' element={<AddBook/>}/>
      <Route path="/books/update/:bookId" element={<UpdateBook />} />    
      <Route path="/books/:id" element={<BookDetail />} />    
      <Route path="/update-user/:userId" element={<UpdateUser />} />
      <Route path="/users/" element={<ListUsers />} />

      
    </Routes>
  </Router>
);
}

export default App