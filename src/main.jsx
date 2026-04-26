import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CampusProvider } from './context/CampusContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CampusProvider>
      <App />
    </CampusProvider>
  </StrictMode>,
)
