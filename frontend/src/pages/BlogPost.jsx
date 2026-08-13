import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatDate, parseBody, readingTime } from '../data/blog'

function Body({ text }) {
  const blocks = parseBody(text)
  return (
    <div className="mt-12 space-y-7">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={i}
              className="pt-6 text-2xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-3xl"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-3">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-4 text-lg leading-relaxed text-gray-800">
                  <span aria-hidden className="mt-3 h-px w-5 flex-none bg-[#f37022]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-lg leading-[1.75] text-gray-800">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  // Tracked together with the slug they belong to, so navigating to
  // another post shows the skeleton instead of the previous article.
  const [result, setResult] = useState({ slug: null, status: 'loading', post: null })

  useEffect(() => {
    let cancelled = false
    fetch(`/api/posts/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (r.status === 404) return Promise.reject(new Error('missing'))
        return r.ok ? r.json() : Promise.reject(new Error('failed'))
      })
      .then((d) => {
        if (!cancelled) setResult({ slug, status: 'ready', post: d.post })
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({
            slug,
            status: err.message === 'missing' ? 'missing' : 'error',
            post: null,
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const state = result.slug === slug ? result.status : 'loading'
  const post = result.slug === slug ? result.post : null

  if (state === 'loading') {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-3xl animate-pulse px-6 py-28">
          <div className="h-3 w-40 bg-[#efece5]" />
          <div className="mt-6 h-12 w-full bg-[#efece5]" />
          <div className="mt-3 h-12 w-2/3 bg-[#efece5]" />
          <div className="mt-12 aspect-[16/9] bg-[#efece5]" />
        </div>
      </main>
    )
  }

  if (state !== 'ready' || !post) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#f37022]">
            {state === 'missing' ? '/ 404' : '/ Something broke'}
          </p>
          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl">
            {state === 'missing' ? (
              <>
                That story isn't
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  {' '}
                  here.
                </span>
              </>
            ) : (
              <>
                We couldn't load
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  {' '}
                  this one.
                </span>
              </>
            )}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-600">
            {state === 'missing'
              ? 'It may have been moved or taken down.'
              : 'Refresh the page, or come back in a minute.'}
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-block border border-gray-800 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-gray-900 transition-colors hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
          >
            ← All stories
          </Link>
        </div>
      </main>
    )
  }

  const meta = [formatDate(post.publishedAt), post.author, `${readingTime(post.body)} min read`]
    .filter(Boolean)
    .join(' · ')

  return (
    <main className="bg-white">
      {/* ─── Title block ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-16 pb-14 md:pt-24 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.13), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-gray-500 transition-colors hover:text-[#f37022]"
          >
            <span aria-hidden>←</span> All stories
          </Link>

          <div style={{ animation: 'fade-up 0.6s ease-out both' }}>
            <p className="mt-8 font-mono text-[11px] font-bold uppercase tabular-nums tracking-[0.22em] text-[#f37022]">
              {meta}
            </p>
            <h1 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-6xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-7 text-lg leading-relaxed text-gray-700 md:text-xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Cover + body ─────────────────────────────────────── */}
      <article className="pb-24 md:pb-32">
        {post.cover && (
          <div className="relative mx-auto -mt-8 max-w-5xl px-6 md:-mt-12">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#efece5]">
              <img
                src={post.cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ animation: 'fade-up 0.6s ease-out 0.08s both' }}
              />
              <span className="absolute left-0 top-0 h-1 w-28 bg-[#f37022]" aria-hidden />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6">
          <Body text={post.body} />

          {post.tags?.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-2 border-t border-gray-200 pt-8">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="border border-[#f37022]/40 bg-[#f37022]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a4360c]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Next step, so the article isn't a dead end */}
          <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-gray-300 pt-10 sm:flex-row sm:items-center">
            <p className="max-w-sm text-sm leading-relaxed text-gray-600">
              Questions about a machine on your site? Our service team answers
              the phone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/blog"
                className="border border-gray-800 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-900 transition-colors hover:border-[#f37022] hover:text-[#f37022]"
              >
                More stories
              </Link>
              <Link
                to="/contact"
                className="bg-[#f37022] px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#d95f16]"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
