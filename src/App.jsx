import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import { Feed } from './components/Feed'
import Profile from './components/Profile'
import SignupForm from './components/SignUpForm'
import Connections from './components/Connections'
import Requests from './components/Requests'
import Premium from './components/Premium'
import Chat from './components/Chat'

function App() {
 

  return (
    <>
    <Provider store={appStore}>
    
      <BrowserRouter basename='/' >
        <Routes>
          <Route
          path='/'
          element={<Body/>}
          >
          <Route
          path='/'
          element={<Feed/>}
          />
          <Route
          path='/login'
          element={<Login/>}
          />
          <Route
          path="/signup"
          element={<SignupForm/>}
          />

          <Route
          element={<Profile/>}
          path='/profile'
          />
          <Route
          path="/connections"
          element={<Connections/>}
          />
          <Route
          path="requests"
          element={<Requests/>}
          />
          
          <Route
          path="/premium"
          element={<Premium/>}
          />
          <Route
          path="/chat/:connectionId"
          element={<Chat/>}
          />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
     
    </>
  )
}

export default App
