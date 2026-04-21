import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import FoodCalculator from './pages/FoodCalculator.tsx'
import CaloriesCalculator from './pages/CaloriesCalculator.tsx'
import ToxicityCalculator from './pages/ToxicityCalculator.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import LegalAdvice from './pages/LegalAdvice.tsx'
import { ThemeToggle } from './components/ThemeToggle.tsx'
import { Layout } from './components/Layout.tsx'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/calculadora', element: <FoodCalculator /> },
      { path: '/calorias', element: <CaloriesCalculator /> },
      { path: '/toxicidad', element: <ToxicityCalculator /> },
      { path: '/politica-privacidad', element: <PrivacyPolicy /> },
      { path: '/aviso-legal', element: <LegalAdvice /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeToggle />
    <RouterProvider router={router} />
  </StrictMode>,
)
