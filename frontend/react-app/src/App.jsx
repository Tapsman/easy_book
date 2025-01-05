import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup'
import Login from './components/Login'

function App(){
  const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

return (
  <div className="App">
    <RouterProvider router={router}></RouterProvider>
  </div>
)
}

export default App
