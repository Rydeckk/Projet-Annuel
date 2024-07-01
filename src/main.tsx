import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper, {App} from "./App"
import { BrowserRouter, Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </React.StrictMode>
)

