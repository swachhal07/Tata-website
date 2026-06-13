import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, posts } from '../data/posts'

function PostCard({ post, index }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]"
      style={{ animation: `fade-up 0.6s ease-out ${0.05 * index}s both` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={post.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 bg-white px-2.5 py-1 font-mono text-xs tabular-nums tracking-tight text-black shadow-sm">
          {post.issue}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-6 md:p-7">
        <span className="absolute left-6 top-0 h-px w-12 bg-[#f37022] md:left-7" />

        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f37022]">
            {post.category}
          </span>
          <span className="font-mono text-xs tabular-nums tracking-tight text-gray-400">
            {post.date}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black uppercase leading-[1.1] tracking-tight text-black transition-colors group-hover:text-[#f37022] md:text-xl">
          {post.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 text-[10px] font-bold uppercase tracking-[0.28em]">
          <span className="text-gray-500">{post.readTime}</span>
          <span className="inline-flex items-center gap-2 text-black">
            Read
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Blog() {
  const [active, setActive] = useState('All')

  const visible =
    active === 'All' ? posts : posts.filter((p) => p.category === active)

  const latest = posts[0]

  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-20 md:pt-28 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
              <span className="h-px w-12 bg-[#f37022]" />
              Field notes
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-black md:text-7xl lg:text-[96px]">
              From the yard.
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                To the worksite.
              </span>
            </h1>
          </div>

          <div
            className="mt-10 flex items-stretch gap-4"
            style={{ animation: 'fade-up 0.7s ease-out 0.15s both' }}
          >
            <div className="w-1 bg-[#f37022]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                Latest issue
              </p>
              <p className="font-mono text-3xl font-bold tabular-nums tracking-tight text-black md:text-4xl">
                {latest.issue}
              </p>
              <p className="mt-2 font-mono text-[11px] tabular-nums tracking-tight text-gray-500">
                {latest.date}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Filter bar ───────────────────────────────────────── */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-5 pt-10 sm:gap-4 md:gap-5 md:pb-6 md:pt-14">
            {categories.map((c) => {
              const isActive = active === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={`shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] transition-colors ${
                    isActive
                      ? 'border-[#f37022] bg-[#f37022] text-white'
                      : 'border-gray-300 text-gray-700 hover:border-black hover:text-black'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Posts grid ───────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022]">
                <span className="h-px w-10 bg-[#f37022]" />
                Recent issues
              </div>
              <h2 className="text-3xl font-black uppercase leading-[1] tracking-tight text-black md:text-4xl">
                {active === 'All' ? 'Everything we\'ve filed.' : `Filed under ${active.toLowerCase()}.`}
              </h2>
            </div>
            <p className="hidden font-mono text-xs tabular-nums tracking-tight text-gray-500 sm:block">
              {String(visible.length).padStart(2, '0')} / {String(posts.length).padStart(2, '0')} posts
            </p>
          </div>

          {visible.length === 0 ? (
            <div className="border border-dashed border-gray-300 bg-white p-16 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gray-500">
                No posts under {active.toLowerCase()} yet
              </p>
              <p className="mx-auto mt-4 max-w-sm text-sm text-gray-500">
                We're working on it. In the meantime, browse the other
                categories above.
              </p>
            </div>
          ) : (
            <div
              key={active}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3"
            >
              {visible.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
