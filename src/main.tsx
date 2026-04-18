import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import FoodCalculator from './pages/FoodCalculator.tsx'
import CaloriesCalculator from './pages/CaloriesCalculator.tsx'

const router = createHashRouter([
  { path: '/', element: <App /> },
  { path: '/calculadora', element: <FoodCalculator /> },
  { path: '/calorias', element: <CaloriesCalculator /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
