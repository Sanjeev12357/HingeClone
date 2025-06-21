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
import ProtectedRoute from './utils/ProtectedRoute'

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename='/'>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          
          {/* Protected routes - each wrapped individually */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Body>
                  <Feed />
                </Body>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Body>
                  <Profile />
                </Body>
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <Body>
                  <Connections />
                </Body>
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Body>
                  <Requests />
                </Body>
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <Body>
                  <Premium />
                </Body>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:connectionId"
            element={
              <ProtectedRoute>
                <Body>
                  <Chat />
                </Body>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
