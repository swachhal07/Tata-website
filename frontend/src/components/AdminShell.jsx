import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

/* Shared chrome for every admin screen: session check, sidebar navigation,
 * page header and the sign-out flow. Pages render their own body only. */

const NAV = [
  {
    to: '/admin',
    end: true,
    label: 'Products',
    hint: 'Machines in the catalogue',
    icon: (
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Zm9 1.8 5.6-2.8L12 4.7 6.4 7.5 12 9.3Zm-1 2L5 8.6v6.6l6 3v-6.9Zm2 9.6 6-3V8.6l-6 2.7v6.6Z" />
    ),
  },
  {
    to: '/admin/locations',
    label: 'Locations',
    hint: 'Branches and map pins',
    icon: (
      <path d="M12 2c3.9 0 7 3.1 7 7 0 5.2-7 13-7 13S5 14.2 5 9c0-3.9 3.1-7 7-7Zm0 4.5A2.5 2.5 0 1 0 12 11a2.5 2.5 0 0 0 0-4.5Z" />
    ),
  },
  {
    to: '/admin/blog',
    label: 'Blog',
    hint: 'Stories and drafts',
    icon: (
      <path d="M5 3h11l3 3v15H5V3Zm2 2v14h10V7h-3V5H7Zm2 5h6v2H9v-2Zm0 4h6v2H9v-2Z" />
    ),
  },
  {
    to: '/admin/people',
    label: 'Team',
    hint: 'Board and management',
    icon: (
      <path d="M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.5.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM1 20c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5v1H1v-1Zm17.4 1c.4-.6.6-1.3.6-2 0-1.7-.8-3.2-2.1-4.3 3.1.4 6.1 2.2 6.1 4.8v1.5h-4.6Z" />
    ),
  },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group relative flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              isActive
                ? 'bg-[#f37022]/10 text-[#a4360c]'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden
                className={`absolute left-0 top-2 h-[calc(100%-1rem)] w-0.5 rounded-full bg-[#f37022] transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <svg
                viewBox="0 0 24 24"
                className={`mt-0.5 h-5 w-5 flex-none ${
                  isActive ? 'fill-[#f37022]' : 'fill-gray-400 group-hover:fill-gray-600'
                }`}
                aria-hidden
              >
                {item.icon}
              </svg>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={`block text-xs ${
                    isActive ? 'text-[#a4360c]/70' : 'text-gray-500'
                  }`}
                >
                  {item.hint}
                </span>
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AdminShell({ title, eyebrow, description, meta, actions, children }) {
  const navigate = useNavigate()
  const [authChecked, setAuthChecked] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (d.admin) setAuthChecked(true)
        else navigate('/login', { replace: true })
      })
      .catch(() => {
        if (!cancelled) navigate('/login', { replace: true })
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    if (!drawerOpen && !logoutOpen) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setDrawerOpen(false)
      if (!signingOut) setLogoutOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen, logoutOpen, signingOut])

  const confirmLogout = async () => {
    setSigningOut(true)
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    navigate('/login', { replace: true })
  }

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-base text-gray-500">Verifying session…</p>
      </main>
    )
  }

  const brand = (
    <div className="flex items-center gap-3">
      <span className="block h-8 w-1 rounded-sm bg-[#f37022]" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-gray-900">Tata Hitachi · Dugar</p>
        <p className="text-xs text-gray-500">Site admin</p>
      </div>
    </div>
  )

  const sidebarFooter = (
    <div className="space-y-1 border-t border-gray-200 pt-4">
      <Link
        to="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none fill-gray-400" aria-hidden>
          <path d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h5v2H6v11h11v-4h2v6H4V5h1Z" />
        </svg>
        View live site
      </Link>
      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none fill-current opacity-60" aria-hidden>
          <path d="M15 4v2H5v12h10v2H3V4h12Zm4.3 4.3 4 3.7-4 3.7-1.4-1.4 1.8-1.6H9v-2h10.7l-1.8-1.6 1.4-1.4Z" />
        </svg>
        Sign out
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-gray-200 bg-white px-4 py-6 lg:flex">
        <div>
          <div className="px-2">{brand}</div>
          <div className="mt-8">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Manage
            </p>
            <NavItems />
          </div>
        </div>
        {sidebarFooter}
      </aside>

      {/* Top bar - mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:border-gray-900"
          aria-label="Open admin menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-72 max-w-[85vw] flex-col justify-between bg-white px-4 py-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            <div>
              <div className="flex items-start justify-between px-2">
                {brand}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              <div className="mt-8">
                <NavItems onNavigate={() => setDrawerOpen(false)} />
              </div>
            </div>
            {sidebarFooter}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="lg:pl-64">
        <div className="border-b border-gray-200 bg-white">
          <div className="flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6 py-8 lg:px-8">
            <div>
              {eyebrow && (
                <p className="text-sm font-medium text-[#f37022]">{eyebrow}</p>
              )}
              <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
              {description && (
                <p className="mt-2.5 max-w-xl text-base text-gray-600">{description}</p>
              )}
              {meta && <p className="mt-4 text-sm text-gray-500">{meta}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </div>

        <main className="max-w-6xl px-6 py-10 lg:px-8">{children}</main>
      </div>

      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !signingOut && setLogoutOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            style={{ animation: 'fade-up 0.2s ease-out both' }}
          >
            <h3 id="logout-title" className="text-lg font-bold text-gray-900">
              Sign out of the console?
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              You'll need the admin email and password again to make more
              changes. Anything typed into a form will be lost.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                disabled={signingOut}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-60"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={signingOut}
                className="rounded-md bg-[#f37022] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#d95f15] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
