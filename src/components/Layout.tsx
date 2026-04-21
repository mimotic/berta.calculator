import { Outlet } from 'react-router'
import { Footer } from './Footer.tsx'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
