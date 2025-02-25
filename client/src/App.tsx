import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Blog from './pages/Blog'

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} /> 
        <Route path='/blog' element={<Blog/>} /> 
      </Routes>
    </div>
  )
}

export default App