import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import FoodCalculator from './pages/FoodCalculator.tsx'
import CaloriesCalculator from './pages/CaloriesCalculator.tsx'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.tsx'
import AvisoLegal from './pages/AvisoLegal.tsx'
import { ThemeToggle } from './components/ThemeToggle.tsx'
import { Layout } from './components/Layout.tsx'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/calculadora', element: <FoodCalculator /> },
      { path: '/calorias', element: <CaloriesCalculator /> },
      { path: '/politica-privacidad', element: <PoliticaPrivacidad /> },
      { path: '/aviso-legal', element: <AvisoLegal /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeToggle />
    <RouterProvider router={router} />
  </StrictMode>,
)
