import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from "./App"
import { BrowserRouter } from 'react-router-dom'
import { AssoContext, AssoProvider } from './context/AssoContext'

export const useAssoContext = () => useContext(AssoContext)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AssoProvider>
        <AppWrapper />
      </AssoProvider> 
    </BrowserRouter>
  </React.StrictMode>
)

