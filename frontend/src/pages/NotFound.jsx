import { Link } from 'react-router-dom'
import Seo from '../seo/Seo'

/* Rendered for any unmatched path. The route still resolves with HTTP 200 —
 * Vercel rewrites everything to index.html — so the `noindex` on this page is
 * what keeps stale and mistyped URLs out of the index. */
export default function NotFound() {
  return (
    <main className="bg-white">
      <Seo
        title="Page not found — Dugar Earthmovers"
        description="This page does not exist. Browse the Tata Hitachi machine range or get in touch with our sales and service team in Nepal."
        noindex
      />
      <section className="mx-auto flex min-h-[70vh] max-w-[1500px] flex-col items-start justify-center px-6 py-24 lg:px-12">
        <p className="font-mono text-xs tabular-nums tracking-tight text-[#f37022]">
          / Error 404
        </p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-black md:text-7xl">
          This page
          <br />
          <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
            isn't in our yard.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
          The link may be out of date, or the address mistyped. Everything we
          sell and service is one click away.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 bg-black px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#f37022]"
          >
            See the machines
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 border border-gray-800 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#f37022] hover:text-[#f37022]"
          >
            Contact us
          </Link>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
            Or go straight to
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-black">
            <Link to="/" className="transition-colors hover:text-[#f37022]">Home</Link>
            <Link to="/compare" className="transition-colors hover:text-[#f37022]">Compare</Link>
            <Link to="/about" className="transition-colors hover:text-[#f37022]">About</Link>
            <Link to="/leadership" className="transition-colors hover:text-[#f37022]">Leadership</Link>
            <Link to="/blog" className="transition-colors hover:text-[#f37022]">Blog</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
