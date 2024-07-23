import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from "./App"
import { BrowserRouter } from 'react-router-dom'
import { AssoContext, AssoProvider } from './context/AssoContext'
import { UserContext, UserProvider } from './context/UserContext'

export const useAssoContext = () => useContext(AssoContext)
export const useUserContext = () => useContext(UserContext)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AssoProvider>
        <UserProvider>
          <AppWrapper />
        </UserProvider>
      </AssoProvider> 
    </BrowserRouter>
  </React.StrictMode>
)


