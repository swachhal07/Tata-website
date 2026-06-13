import { Link, useParams, Navigate } from 'react-router-dom'
import { posts } from '../data/posts'

function ContentBlock({ block }) {
  if (block.type === 'h') {
    return (
      <h3 className="mt-12 text-2xl font-black uppercase leading-[1.1] tracking-tight text-black md:text-3xl">
        {block.text}
      </h3>
    )
  }
  if (block.type === 'list') {
    return (
      <ul className="mt-6 space-y-3">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-base leading-relaxed text-gray-700 md:text-lg">
            <span className="mt-3 h-1 w-3 shrink-0 bg-[#f37022]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
      {block.text}
    </p>
  )
}

function RelatedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={post.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 bg-white px-2.5 py-1 font-mono text-xs tabular-nums tracking-tight text-black">
          {post.issue}
        </div>
      </div>
      <div className="relative pt-5">
        <span className="absolute left-0 top-0 h-px w-12 bg-[#f37022]" />
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f37022]">
            {post.category}
          </span>
          <span className="font-mono text-xs tabular-nums tracking-tight text-gray-400">
            {post.date}
          </span>
        </div>
        <h4 className="mt-3 text-base font-black uppercase leading-[1.15] tracking-tight text-black transition-colors group-hover:text-[#f37022] md:text-lg">
          {post.title}
        </h4>
      </div>
    </Link>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const related = posts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <main className="bg-white">
      {/* ─── Article header ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-16 pb-16 md:pt-24 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 hidden h-[480px] w-[480px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.12), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gray-600 transition-colors hover:text-[#f37022]"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to field notes
          </Link>
        </div>

        <div className="relative mx-auto mt-10 max-w-[1100px] px-6 lg:px-12">
          <div
            className="flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ animation: 'fade-up 0.6s ease-out both' }}
          >
            <span className="font-mono text-sm tabular-nums tracking-tight text-black">
              {post.issue}
            </span>
            <span className="h-px w-8 bg-[#f37022]" />
            <span className="text-[#f37022]">{post.category}</span>
          </div>

          <h1
            className="mt-6 text-center text-4xl font-black uppercase leading-[0.98] tracking-[-0.02em] text-black md:text-5xl lg:text-6xl"
            style={{ animation: 'fade-up 0.6s ease-out 0.1s both' }}
          >
            {post.title}
          </h1>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 border-t border-gray-300 pt-6 text-center"
            style={{ animation: 'fade-up 0.6s ease-out 0.2s both' }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
                Filed by
              </p>
              <p className="mt-1 text-sm font-bold text-black">{post.author}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
                Published
              </p>
              <p className="mt-1 font-mono text-sm tabular-nums tracking-tight text-black">
                {post.date}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
                Read time
              </p>
              <p className="mt-1 text-sm font-bold text-black">{post.readTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hero image ──────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="relative -mt-10 aspect-[16/9] overflow-hidden md:-mt-16">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute left-0 top-0 h-1 w-32 bg-[#f37022]" />
          </div>
        </div>
      </section>

      {/* ─── Article body ────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[760px] px-6">
          {post.lead && (
            <p className="font-serif text-xl italic leading-relaxed text-black md:text-2xl">
              {post.lead}
            </p>
          )}
          <div className="mt-2">
            {post.content?.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}
          </div>

          {/* Article footer */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:text-[#f37022]"
              >
                <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                  ←
                </span>
                All field notes
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 border border-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
              >
                Talk to our team
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
