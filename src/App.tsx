import { Link } from 'react-router'
import logo from './assets/logo.png'
import './index.css'

export default function App() {
  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <img
            src={logo}
            alt="berta"
            className="w-20 h-20 mx-auto mb-2 [image-rendering:pixelated]"
          />
          <h1 className="text-[32px] font-normal tracking-tight mb-2">Nutrición canina</h1>
          <p className="text-[13px] font-mono text-[#7a7a75] dark:text-[#8a8a85]">Herramientas para planificar la dieta</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/calorias"
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
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
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
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
            className="group relative bg-white dark:bg-[#1a1a18] border border-[#e8e6e0] dark:border-white/10 rounded-lg p-6 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] hover:shadow-[0_4px_20px_rgba(91,141,239,0.08)] transition-all duration-200"
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
        </div>
      </div>
    </div>
  )
}
