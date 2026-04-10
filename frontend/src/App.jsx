import {BrowserRouter,Route,Routes} from 'react-router-dom'

import Login from './pages/Login';

import React from 'react'
import Register from './pages/Register';
import Map from './pages/Map';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
      
     </Routes>
    </BrowserRouter>
  )
}

export default App