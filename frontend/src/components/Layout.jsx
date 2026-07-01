import { Component } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

class PageErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.error('[Page render] failed', err) }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-6 py-24 lg:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f37022]">Something broke</p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl">
            This page didn't load.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-700">
            Please try refreshing. For anything urgent, call{' '}
            <a href="tel:+9779801007228" className="font-bold text-black underline decoration-[#f37022] underline-offset-4 hover:text-[#f37022]">
              +977 9801007228
            </a>{' '}
            or email{' '}
            <a href="mailto:sales.tatahitachinp@gmail.com" className="font-bold text-black underline decoration-[#f37022] underline-offset-4 hover:text-[#f37022]">
              sales.tatahitachinp@gmail.com
            </a>.
          </p>
        </section>
      )
    }
    return this.props.children
  }
}

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageErrorBoundary resetKey={pathname}>
          <Outlet />
        </PageErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
