import { Link } from 'react-router'

export function Header() {
  return (
    <div className="mb-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6b6b67] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
        Volver
      </Link>
    </div>
  )
}
