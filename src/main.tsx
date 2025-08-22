import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import MainApp from './AppMain'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MainApp/>
    <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
  </BrowserRouter>
)
