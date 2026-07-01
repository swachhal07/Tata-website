import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import logo from '../assets/Tata-Hitachi-Construction-Machinery-Logo-Vector.png'
import dugarLogo from '../assets/MVDUGAR-01.png'

const leftNavItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
]

const aboutChildren = [
  { to: '/about', label: 'About Us' },
  { to: '/leadership', label: 'Leadership' },
]

const rightNavItems = [
  { to: '/compare', label: 'Why us' },
  { to: '/about', label: 'About', children: aboutChildren },
]

const allNavItems = [...leftNavItems, ...rightNavItems]

function NavItem({ item, isHome }) {
  if (item.children) {
    return <NavDropdown item={item} isHome={isHome} />
  }
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

function NavDropdown({ item, isHome }) {
  const { pathname } = useLocation()
  const isActive = item.children.some((c) => c.to === pathname)

  return (
    <div className="group/dd relative">
      <NavLink
        to={item.to}
        className={`relative inline-flex items-center gap-1.5 pb-1 text-base font-medium transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-[#f37022] after:transition-transform after:duration-200 after:origin-left ${
          isActive
            ? 'after:scale-x-100'
            : 'after:scale-x-0 group-hover/dd:after:scale-x-100'
        } ${
          isHome
            ? 'text-white group-hover/nav:text-black'
            : 'text-gray-800 hover:text-black'
        }`}
      >
        {item.label}
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5 group-hover/dd:bg-[#f37022]/15">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="transition-transform duration-200 group-hover/dd:rotate-180"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </NavLink>

      {/* Dropdown panel */}
      <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover/dd:visible group-hover/dd:opacity-100">
        {/* Upward caret */}
        <span className="absolute left-1/2 top-[7px] h-3 w-3 -translate-x-1/2 rotate-45 rounded-tl-sm border-l border-t border-black/5 bg-white" />
        <div className="relative rounded-2xl bg-white p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          {item.children.map((child, i) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-[15px] font-semibold transition ${
                  i !== 0 ? 'border-t border-gray-100' : ''
                } ${
                  isActive
                    ? 'bg-gray-50 text-[#f37022]'
                    : 'text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
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
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:gap-10">
        <nav className="hidden items-center justify-end gap-10 pr-8 md:flex">
          {leftNavItems.map((item) => (
            <NavItem key={item.to} item={item} isHome={isHome} />
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex md:translate-x-8">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Tata Hitachi Construction Machinery"
              className="h-16 w-auto"
            />
          </Link>
          <span className="h-12 w-px bg-gray-300" aria-hidden="true" />
          <a
            href="https://www.mvdugar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
            aria-label="Visit MV Dugar Group website"
          >
            <img
              src={dugarLogo}
              alt="MV Dugar Group"
              className="relative -left-16 h-20 w-auto"
            />
          </a>
        </div>

        <Link to="/" className="flex items-center md:hidden">
          <img src={logo} alt="Tata Hitachi" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center justify-start gap-10 -ml-10 md:flex">
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
            <div key={item.to}>
              {item.children ? (
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  {item.label}
                </p>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-[#f37022]/10 text-[#f37022]' : 'text-gray-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )}
              {item.children && (
                <div className="flex flex-col">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `rounded px-3 py-2 text-sm font-medium ${
                          isActive ? 'bg-[#f37022]/10 text-[#f37022]' : 'text-gray-700'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-center rounded-full border border-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  )
}
