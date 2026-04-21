import { Link } from 'react-router'

export default function LegalAdvice() {
  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 px-6 py-12 transition-colors">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-xs font-mono text-[#5B8DEF] hover:underline mb-8 inline-block">← Volver</Link>
        <h1 className="text-[28px] font-normal tracking-tight mb-6">Aviso legal</h1>
        <p className="text-sm font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed">
          Contenido pendiente de redactar.
        </p>
      </div>
    </div>
  )
}
