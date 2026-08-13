import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import logo from '../assets/Tata-Hitachi-Construction-Machinery-Logo-Vector.png'
import dugarLogo from '../assets/MVDUGAR-01.png'

const aboutChildren = [
  { to: '/about', label: 'About Us' },
  { to: '/leadership', label: 'Leadership' },
]

const allNavItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/compare', label: 'Why us' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About', children: aboutChildren },
]

function NavItem({ item }) {
  if (item.children) {
    return <NavDropdown item={item} />
  }
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `relative inline-flex pb-1 text-base font-semibold transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-[#f37022] after:transition-transform after:duration-200 after:origin-left ${
          isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
        } ${isActive ? 'text-[#f37022]' : 'text-gray-600 hover:text-black'}`
      }
    >
      {item.label}
    </NavLink>
  )
}

function NavDropdown({ item }) {
  const { pathname } = useLocation()
  const isActive = item.children.some((c) => c.to === pathname)

  return (
    <div className="group/dd relative">
      <NavLink
        to={item.to}
        className={`relative inline-flex items-center gap-1.5 pb-1 text-base font-semibold transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-[#f37022] after:transition-transform after:duration-200 after:origin-left ${
          isActive
            ? 'after:scale-x-100'
            : 'after:scale-x-0 group-hover/dd:after:scale-x-100'
        } ${isActive ? 'text-[#f37022]' : 'text-gray-600 hover:text-black'}`}
      >
        {item.label}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="transition-transform duration-200 group-hover/dd:rotate-180"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
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

  return (
    <header
      className="group/nav sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm"
    >
      <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 z-10 h-1 bg-[#f37022]" />
      <div className="flex w-full items-center justify-between gap-6 px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8">
        {/* Logo lockup - left */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.mvdugar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center md:flex"
            aria-label="Visit MV Dugar Group website"
          >
            <img
              src={dugarLogo}
              alt="MV Dugar Group"
              className="h-14 w-14 object-cover"
            />
          </a>
          <span className="hidden h-10 w-px bg-gray-300 md:block" aria-hidden="true" />
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Tata Hitachi Construction Machinery"
              className="h-9 w-auto md:h-11"
            />
          </Link>
        </div>

        {/* Links - centred */}
        <nav className="hidden items-center justify-center gap-9 md:flex">
          {allNavItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden rounded-full border-2 border-[#f37022] bg-transparent px-7 py-2.5 text-base font-bold text-[#f37022] transition hover:bg-[#f37022] hover:text-white md:ml-auto md:inline-block md:w-fit md:justify-self-end"
        >
          Contact Us
        </Link>

        <button
          className="text-gray-800 md:hidden"
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
            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#f37022] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95f16]"
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  )
}
