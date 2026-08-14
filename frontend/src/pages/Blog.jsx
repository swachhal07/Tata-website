import { useEffect, useState } from 'react'
import Seo from '../seo/Seo'
import { Link } from 'react-router-dom'
import { autoExcerpt, formatDate, readingTime } from '../data/blog'

function Kicker({ children }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
      <span className="h-px w-12 bg-[#f37022]" />
      {children}
    </div>
  )
}

function Meta({ post, className = '' }) {
  const bits = [formatDate(post.publishedAt), post.author, `${readingTime(post.body)} min read`]
    .filter(Boolean)
  return (
    <p
      className={`font-mono text-[11px] font-bold uppercase tabular-nums tracking-[0.22em] ${className}`}
    >
      {bits.join(' · ')}
    </p>
  )
}

/* The newest post gets the full-width treatment; the rest sit in a grid. */
function LeadPost({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-8 border-b border-gray-300 pb-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14"
      style={{ animation: 'fade-up 0.6s ease-out both' }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#efece5] lg:order-2">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.3em] text-gray-400">
            Dugar Earthmovers
          </span>
        )}
        <span className="absolute left-0 top-0 h-1 w-24 bg-[#f37022]" aria-hidden />
      </div>

      <div className="lg:order-1">
        <Meta post={post} className="text-[#f37022]" />
        <h2 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black transition-colors group-hover:text-[#f37022] md:text-5xl">
          {post.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-700">
          {post.excerpt || autoExcerpt(post.body)}
        </p>
        <span className="mt-7 inline-flex items-center gap-3 border-b-2 border-[#f37022] pb-1 text-xs font-bold uppercase tracking-[0.24em] text-black">
          Read the story
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}

function PostCard({ post, index }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col"
      style={{ animation: `fade-up 0.6s ease-out ${0.06 * index}s both` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#efece5]">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.3em] text-gray-400">
            Dugar Earthmovers
          </span>
        )}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-1 w-0 bg-[#f37022] transition-[width] duration-500 ease-out group-hover:w-full"
        />
      </div>

      <Meta post={post} className="mt-6 text-gray-500" />
      <h3 className="mt-3 text-xl font-black uppercase leading-[1.05] tracking-tight text-black transition-colors group-hover:text-[#f37022] md:text-2xl">
        {post.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {post.excerpt || autoExcerpt(post.body, 130)}
      </p>
      {post.tags?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="border border-gray-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [state, setState] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetch('/api/posts')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((d) => {
        if (cancelled) return
        setPosts(Array.isArray(d.posts) ? d.posts : [])
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const [lead, ...rest] = posts

  return (
    <main className="bg-white">
      <Seo path="/blog" />
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-16 md:pt-28 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
          <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
            <Kicker>From the yard</Kicker>
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-black md:text-7xl lg:text-[104px]">
              Notes from
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                the ground up.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
              Machine walk-throughs, maintenance we've learned the hard way, and
              what's happening on projects across Nepal, written by the people
              who service the fleet.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Posts ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          {state === 'loading' && (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#efece5]" />
                  <div className="mt-6 h-3 w-32 bg-[#efece5]" />
                  <div className="mt-4 h-6 w-3/4 bg-[#efece5]" />
                  <div className="mt-3 h-4 w-full bg-[#efece5]" />
                </div>
              ))}
            </div>
          )}

          {state === 'error' && (
            <div className="border border-gray-300 bg-[#f7f5f0] px-8 py-16 text-center">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#f37022]">
                / Couldn't load
              </p>
              <p className="mt-4 text-lg text-gray-700">
                The stories didn't come through. Refresh the page, or come back
                in a minute.
              </p>
            </div>
          )}

          {state === 'ready' && posts.length === 0 && (
            <div className="border border-gray-300 bg-[#f7f5f0] px-8 py-20 text-center">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#f37022]">
                / Nothing published yet
              </p>
              <h2 className="mx-auto mt-5 max-w-lg text-3xl font-black uppercase leading-[1] tracking-tight text-black md:text-4xl">
                The first story is
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  {' '}
                  being written.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-600">
                In the meantime, the spec sheets and the service network are the
                fastest way to get what you need.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/products"
                  className="border border-gray-800 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-gray-900 transition-colors hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
                >
                  Browse machines
                </Link>
                <Link
                  to="/contact"
                  className="bg-[#f37022] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#d95f16]"
                >
                  Talk to us
                </Link>
              </div>
            </div>
          )}

          {state === 'ready' && posts.length > 0 && (
            <>
              <LeadPost post={lead} />

              {rest.length > 0 && (
                <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
