import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, Search, User, LogOut } from 'lucide-react'
import { BRAND } from '../config/brand'
import { getCommonHeaders, clearAuthentication } from '@/lib/api'

export function NexusHeader() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isAuthed = !!getCommonHeaders()?.Authorization

  const handleLogout = () => {
    clearAuthentication()
    router.navigate({ to: '/sign-in' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#03080a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1880px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#c8ff00] flex items-center justify-center">
            <span className="text-black font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-white text-lg">{BRAND.shortName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {BRAND.nav.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-white">
            <Search size={18} />
          </button>
          {isAuthed ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <User size={16} />
                <span className="text-sm">Personal</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0f12] border border-white/10 rounded-xl py-2 shadow-xl">
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Bell size={14} /> 通知中心
                  </Link>
                  <Link
                    to="/console/keys"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    控制台
                  </Link>
                  <Link
                    to="/console/usage"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    用量统计
                  </Link>
                  <div className="border-t border-white/5 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="text-sm bg-[#c8ff00] text-black px-4 py-1.5 rounded-lg font-semibold hover:bg-[#b0e600] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#03080a] border-t border-white/5 px-6 py-4 space-y-3">
          {BRAND.nav.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className="block text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5">
            {isAuthed ? (
              <button onClick={handleLogout} className="text-red-400 text-sm">
                Sign Out
              </button>
            ) : (
              <Link to="/sign-in" className="text-white text-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
