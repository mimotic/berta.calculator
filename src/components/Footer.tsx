import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e8e6e0] dark:border-white/10 bg-[#f9f8f6] dark:bg-[#0f0f0e] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-4">
          <Link
            to="/politica-privacidad"
            className="text-xs font-mono text-[#7a7a75] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors"
          >
            Política de privacidad
          </Link>
          <Link
            to="/aviso-legal"
            className="text-xs font-mono text-[#7a7a75] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors"
          >
            Aviso legal
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-[#9a9a95] dark:text-[#7a7a75]">
            © {new Date().getFullYear()} Berta Calculator
          </p>
          <a href="https://mimotic.com" className="flex items-center text-xs font-mono text-[#9a9a95] dark:text-[#7a7a75] transition hover:text-zinc-900 dark:hover:text-[#e8e6e0]">
            <span className="mr-1">made by mimotic with</span>
            <svg className="shrink-0 [:where(&amp;)]:size-6 size-4 text-red-600" data-flux-icon="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
