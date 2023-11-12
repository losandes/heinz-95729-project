import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Router } from '@lib/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router pages={
        import.meta.glob('./pages/**/*.tsx', { eager: true })
      }/>
    </BrowserRouter>
  </React.StrictMode>,
)
