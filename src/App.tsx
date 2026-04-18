import { useState, useEffect } from 'react'
import FoodCalculator from './FoodCalculator'
import './index.css'

export default function App() {
  const [page, setPage] = useState(window.location.hash)

  useEffect(() => {
    const onHash = () => setPage(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (page === '#/calculadora') return <FoodCalculator />

  return (
    <div className="font-serif bg-[#f9f8f6] text-[#1a1a18] min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-[28px] font-normal tracking-tight mb-4">Dieta Berta</h1>
        <a
          href="#/calculadora"
          className="text-[15px] font-mono text-[#5B8DEF] underline underline-offset-4 hover:text-[#3a6fd8]"
        >
          Abrir calculadora →
        </a>
      </div>
    </div>
  )
}
