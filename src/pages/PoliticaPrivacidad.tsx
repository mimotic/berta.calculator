import { Link } from 'react-router'

export default function PoliticaPrivacidad() {
  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] min-h-screen px-6 py-12 transition-colors">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-[12px] font-mono text-[#5B8DEF] hover:underline mb-8 inline-block">← Volver</Link>
        <h1 className="text-[28px] font-normal tracking-tight mb-6">Política de privacidad</h1>
        <p className="text-[14px] font-mono text-[#7a7a75] dark:text-[#8a8a85] leading-relaxed">
          Contenido pendiente de redactar.
        </p>
      </div>
    </div>
  )
}
