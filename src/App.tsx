import { useState } from 'react'
import { Link } from 'react-router'
import logo from './assets/berta_logo.png'
import './index.css'

export default function App() {
  const [greeting, setGreeting] = useState(0)

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 flex items-center justify-center px-4 py-6 transition-colors">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <button
            type="button"
            onClick={() => setGreeting(count => count + 1)}
            aria-label="Saludar a Berta"
            title="¡Saluda a Berta!"
            className="block w-20 h-20 mx-auto mb-2 rounded-lg cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <img
              key={greeting}
              src={logo}
              alt=""
              width={80}
              height={80}
              draggable={false}
              className={`w-full h-full [image-rendering:pixelated]${greeting > 0 ? ' berta-greeting' : ''}`}
            />
          </button>
          <h1 className="text-[32px] font-normal tracking-tight mb-2">Nutrición canina</h1>
          <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85]">Herramientas para planificar la dieta</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link
            to="/calorias"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 cursor-pointer rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
          >
            <div className="text-[11px] font-mono text-[#9a9a95] dark:text-[#7a7a75] uppercase tracking-wider mb-3">01</div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Calculadora de calorías</h2>
            <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed mb-6">
              Necesidades energéticas diarias a partir del perfil del perro.
            </p>
            <span className="text-[13px] font-mono text-[#5B8DEF] group-hover:translate-x-1 inline-block transition-transform">
              Abrir →
            </span>
          </Link>
          <Link
            to="/calculadora"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 cursor-pointer rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
          >
            <div className="text-[11px] font-mono text-[#9a9a95] dark:text-[#7a7a75] uppercase tracking-wider mb-3">02</div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Calculadora de dieta</h2>
            <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed mb-6">
              Raciones de carne, verdura y suplementos según peso y actividad.
            </p>
            <span className="text-[13px] font-mono text-[#5B8DEF] group-hover:translate-x-1 inline-block transition-transform">
              Abrir →
            </span>
          </Link>
          <Link
            to="/toxicidad"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 cursor-pointer rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
          >
            <div className="text-[11px] font-mono text-[#9a9a95] dark:text-[#7a7a75] uppercase tracking-wider mb-3">03</div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Calculadora de toxicidad</h2>
            <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed mb-6">
              Grado de riesgo 1–5 según alimento ingerido y peso del perro.
            </p>
            <span className="text-[13px] font-mono text-[#5B8DEF] group-hover:translate-x-1 inline-block transition-transform">
              Abrir →
            </span>
          </Link>
          <Link
            to="/anos-humanos"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 cursor-pointer rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
          >
            <div className="text-[11px] font-mono text-[#9a9a95] dark:text-[#7a7a75] uppercase tracking-wider mb-3">04</div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Años en humano</h2>
            <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed mb-6">
              Equivalencia entre la edad del perro y años humanos según su tamaño.
            </p>
            <span className="text-[13px] font-mono text-[#5B8DEF] group-hover:translate-x-1 inline-block transition-transform">
              Abrir →
            </span>
          </Link>
          <Link
            to="/recetas"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 cursor-pointer rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
          >
            <div className="text-[11px] font-mono text-[#9a9a95] dark:text-[#7a7a75] uppercase tracking-wider mb-3">05</div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Mis recetas</h2>
            <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed mb-6">
              Recetas guardadas desde la calculadora de dieta, en modo consulta.
            </p>
            <span className="text-[13px] font-mono text-[#5B8DEF] group-hover:translate-x-1 inline-block transition-transform">
              Abrir →
            </span>
          </Link>
          <Link
            to="/recetas/comparar"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 cursor-pointer rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
          >
            <div className="text-[11px] font-mono text-[#9a9a95] dark:text-[#7a7a75] uppercase tracking-wider mb-3">06</div>
            <h2 className="text-xl font-normal tracking-tight mb-2">Comparar recetas</h2>
            <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed mb-6">
              Dos recetas guardadas lado a lado: ingredientes, macros y micronutrientes.
            </p>
            <span className="text-[13px] font-mono text-[#5B8DEF] group-hover:translate-x-1 inline-block transition-transform">
              Abrir →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
