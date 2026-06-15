import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import logo from '../assets/Tata-Hitachi-Construction-Machinery-Logo-Vector.png'

const leftNavItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
]

const rightNavItems = [
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About Us' },
]

const allNavItems = [...leftNavItems, ...rightNavItems]

function NavItem({ item, isHome }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `relative inline-flex pb-1 text-base font-medium transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-[#f37022] after:transition-transform after:duration-200 after:origin-left ${
          isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
        } ${
          isHome
            ? 'text-white group-hover/nav:text-black'
            : 'text-gray-800 hover:text-black'
        }`
      }
    >
      {item.label}
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 80) {
        setHidden(false)
      } else if (currentY > lastScrollY.current + 4) {
        setHidden(true)
      } else if (currentY < lastScrollY.current - 4) {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`group/nav top-0 z-50 transform transition-all duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isHome
          ? 'absolute inset-x-0 border-b border-white/30 bg-transparent hover:bg-white hover:shadow-sm'
          : 'sticky border-b border-gray-200 bg-white shadow-sm'
      }`}
    >
      {!isHome && (
        <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 z-10 h-1 bg-[#f37022]" />
      )}
      <Link
        to="/contact"
        className={`absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border px-6 py-2.5 text-base font-semibold transition md:inline-block ${
          isHome
            ? 'border-white text-white group-hover/nav:border-gray-800 group-hover/nav:text-gray-800 hover:!border-[#f37022] hover:!bg-[#f37022] hover:!text-white'
            : 'border-gray-800 text-gray-800 hover:!border-[#f37022] hover:!bg-[#f37022] hover:!text-white'
        }`}
      >
        Contact Us
      </Link>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <nav className="hidden flex-1 items-center justify-end gap-10 md:flex">
          {leftNavItems.map((item) => (
            <NavItem key={item.to} item={item} isHome={isHome} />
          ))}
        </nav>

        <Link to="/" className="flex items-center md:mx-24">
          <img
            src={logo}
            alt="Tata Hitachi Construction Machinery"
            className="h-16 w-auto"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-10 md:flex">
          {rightNavItems.map((item) => (
            <NavItem key={item.to} item={item} isHome={isHome} />
          ))}
        </nav>

        <button
          className={`md:hidden ${isHome ? 'text-white' : 'text-gray-800'}`}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-6 py-3 md:hidden">
          {allNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-[#f37022]/10 text-[#f37022]' : 'text-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
