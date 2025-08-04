import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import MainApp from './AppMain'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MainApp/>
  </BrowserRouter>
)
