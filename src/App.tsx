import { Link } from 'react-router'
import './index.css'

export default function App() {
  return (
    <div className="font-serif bg-[#f9f8f6] text-[#1a1a18] min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-[28px] font-normal tracking-tight mb-4">Dieta Berta</h1>
        <div className="flex flex-col gap-3">
          <Link
            to="/calculadora"
            className="text-[15px] font-mono text-[#5B8DEF] underline underline-offset-4 hover:text-[#3a6fd8]"
          >
            Calculadora de dieta →
          </Link>
          <Link
            to="/calorias"
            className="text-[15px] font-mono text-[#5B8DEF] underline underline-offset-4 hover:text-[#3a6fd8]"
          >
            Calculadora de calorías →
          </Link>
        </div>
      </div>
    </div>
  )
}
