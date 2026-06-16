import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) navigate(from, { replace: true })
      })
      .catch(() => {})
  }, [from, navigate])

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Login failed')
      }
      navigate(from, { replace: true })
    } catch (err) {
      setStatus('idle')
      setError(err.message)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f0] text-black">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 hidden h-[520px] w-[520px] lg:block"
        style={{
          background:
            'radial-gradient(closest-side, rgba(243,112,34,0.16), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[1px] bg-gradient-to-b from-transparent via-black/10 to-transparent lg:block"
      />

      {/* Top strip */}
      <div className="relative z-10 flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <Link
          to="/"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-black/70 transition-colors hover:text-[#f37022]"
        >
          ← Tata Hitachi · Dugar Earthmovers
        </Link>
        <span className="hidden font-mono text-[10px] tabular-nums tracking-[0.3em] text-black/40 sm:block">
          / 01 · Console
        </span>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-65px)] max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-12 md:px-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* Left — headline */}
        <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
          <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-[#f37022]">
            / Admin access
          </p>
          <h1 className="text-[52px] font-black uppercase leading-[0.92] tracking-[-0.025em] text-black sm:text-7xl md:text-[88px] lg:text-[104px]">
            Restricted.
            <br />
            <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
              Staff only.
            </span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-gray-700 md:text-lg">
            The console is where the catalogue is maintained &mdash; adding
            machines, updating specs, lining up brochures. Sign in with the
            staff password to continue.
          </p>

          {/* Spec strip */}
          <div className="mt-12 grid max-w-md grid-cols-3 border-l border-t border-black/15">
            {[
              ['Network', '10 branches'],
              ['Est.', '1995'],
              ['Region', 'Nepal'],
            ].map(([k, v]) => (
              <div
                key={k}
                className="border-b border-r border-black/15 px-4 py-4"
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-black/40">
                  {k}
                </p>
                <p className="mt-1.5 font-mono text-sm font-bold tabular-nums tracking-tight text-black">
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — card */}
        <div
          className="relative bg-white p-8 md:p-12"
          style={{
            boxShadow: '0 50px 100px -60px rgba(0,0,0,0.4)',
            animation: 'fade-up 0.7s ease-out 0.15s both',
          }}
        >
          <span className="absolute left-0 top-0 h-1 w-32 bg-[#f37022]" />
          <span className="absolute right-0 top-0 h-32 w-1 bg-[#f37022]" />

          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#f37022]">
            / Sign in
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-[1] tracking-tight text-black md:text-4xl">
            Console
            <br />
            <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
              access.
            </span>
          </h2>

          <form onSubmit={submit} className="mt-10 space-y-7">
            <div>
              <label
                htmlFor="th-email"
                className="block text-[10px] font-bold uppercase tracking-[0.32em] text-gray-500"
              >
                Email <span className="text-[#f37022]">*</span>
              </label>
              <input
                id="th-email"
                type="email"
                required
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales.tatahitachinp@gmail.com"
                className="mt-3 block w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2.5 text-base text-black placeholder:text-gray-300 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="th-pw"
                className="flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.32em] text-gray-500"
              >
                <span>
                  Password <span className="text-[#f37022]">*</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="font-mono text-[10px] tracking-[0.25em] text-gray-400 transition-colors hover:text-[#f37022]"
                >
                  {show ? 'hide' : 'show'}
                </button>
              </label>
              <input
                id="th-pw"
                type={show ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-3 block w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2.5 font-mono text-lg tracking-[0.1em] text-black placeholder:text-gray-300 focus:border-black focus:outline-none"
              />
            </div>

            {error && (
              <p className="border-l-2 border-[#f37022] bg-[#fdecdf] px-3 py-2.5 text-sm font-medium text-[#a4360c]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-black px-8 py-5 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#f37022] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{status === 'sending' ? 'Signing in…' : 'Enter console'}</span>
              <svg viewBox="0 0 24 24" className="h-3 w-5 transition-transform group-hover:translate-x-1" aria-hidden>
                <path d="M0 11h20l-6-6 1.4-1.4L24 12l-8.6 8.4L14 19l6-6H0z" fill="currentColor" />
              </svg>
            </button>
          </form>

          <p className="mt-8 border-t border-gray-200 pt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-400">
            Forgotten the password? Ask the IT desk &mdash;{' '}
            <span className="text-black">Balaju, Kathmandu</span>
          </p>
        </div>
      </div>
    </main>
  )
}
