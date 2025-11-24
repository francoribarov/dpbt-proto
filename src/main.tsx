import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { PreconsultaProvider } from './context/PreconsultaContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PreconsultaProvider>
        <App />
      </PreconsultaProvider>
    </BrowserRouter>
  </StrictMode>,
)
