import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { formatDate, readingTime } from '../data/blog'

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  author: '',
  tags: '',
  published: false,
}

const inputCls =
  'block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#f37022] focus:outline-none focus:ring-2 focus:ring-[#f37022]/20'

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-[#f37022]">*</span>}
      </span>
      {hint && <span className="mt-1 block text-sm text-gray-500">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

export default function AdminBlog() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [existingCover, setExistingCover] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const coverInputRef = useRef(null)
  const formRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/posts', { credentials: 'include' })
      if (res.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (!res.ok) throw new Error('Could not load posts')
      const d = await res.json()
      setPosts(Array.isArray(d.posts) ? d.posts : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // AdminShell has already verified the session before this mounts.
  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/posts', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load posts'))))
      .then((d) => {
        if (cancelled) return
        setPosts(Array.isArray(d.posts) ? d.posts : [])
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : null),
    [coverFile],
  )
  useEffect(() => {
    if (!coverPreview) return
    return () => URL.revokeObjectURL(coverPreview)
  }, [coverPreview])

  useEffect(() => {
    if (!deleteTarget) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !deleting) setDeleteTarget(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteTarget, deleting])

  const counts = useMemo(
    () => ({
      published: posts.filter((p) => p.published).length,
      drafts: posts.filter((p) => !p.published).length,
    }),
    [posts],
  )

  // Until the slug is edited by hand it tracks the title.
  const slug = slugTouched ? slugify(form.slug) : slugify(form.title)

  const updateField = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setEditingId(null)
    setCoverFile(null)
    setExistingCover(null)
    setError('')
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  const enterEdit = (post) => {
    setEditingId(post.id)
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      body: post.body || '',
      author: post.author || '',
      tags: (post.tags || []).join(', '),
      published: !!post.published,
    })
    setSlugTouched(true)
    setCoverFile(null)
    setExistingCover(post.cover || null)
    setError('')
    setSuccess(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  const submit = async (publishOverride) => {
    if (!form.title.trim()) {
      setError('Give the post a title')
      return
    }
    if (!form.body.trim()) {
      setError('The post needs some body text')
      return
    }
    const published = publishOverride ?? form.published
    setStatus('sending')
    setError('')
    setSuccess(null)
    try {
      const fd = new FormData()
      fd.append('title', form.title.trim())
      fd.append('slug', slug)
      fd.append('excerpt', form.excerpt.trim())
      fd.append('body', form.body)
      fd.append('author', form.author.trim())
      fd.append('tags', form.tags)
      fd.append('published', String(published))
      if (coverFile) fd.append('cover', coverFile)

      const res = await fetch(
        editingId ? `/api/admin/posts/${encodeURIComponent(editingId)}` : '/api/admin/posts',
        { method: editingId ? 'PUT' : 'POST', credentials: 'include', body: fd },
      )
      if (res.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not save')
      setSuccess(data.post)
      resetForm()
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setStatus('idle')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not remove')
      }
      if (editingId === deleteTarget.id) resetForm()
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (post) => {
    const fd = new FormData()
    fd.append('title', post.title)
    fd.append('slug', post.slug)
    fd.append('excerpt', post.excerpt || '')
    fd.append('body', post.body)
    fd.append('author', post.author || '')
    fd.append('tags', (post.tags || []).join(', '))
    fd.append('published', String(!post.published))
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(post.id)}`, {
        method: 'PUT',
        credentials: 'include',
        body: fd,
      })
      if (!res.ok) throw new Error('Could not change the status')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminShell
      eyebrow={editingId ? 'Editing a post' : 'Blog'}
      title="Stories"
      description="Write a post, save it as a draft, and publish when it's ready. Published posts appear on the public blog immediately."
      meta={`${counts.published} published · ${counts.drafts} drafts`}
      actions={
        <Link
          to="/blog"
          target="_blank"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
        >
          View blog ↗
        </Link>
      }
    >
      {success && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f37022]/30 bg-orange-50 px-4 py-3">
          <p className="text-sm font-medium text-[#a4360c]">
            “{success.title}” saved{success.published ? ' and published' : ' as a draft'}.
          </p>
          {success.published && (
            <a
              href={`/blog/${success.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-[#f37022]"
            >
              Open it ↗
            </a>
          )}
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="mb-12 scroll-mt-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId ? 'Edit post' : 'Write a post'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-[#f37022]"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div className="space-y-5">
            <Field label="Title" required>
              <input
                type="text"
                required
                value={form.title}
                onChange={updateField('title')}
                placeholder="What 5,000-hour service intervals actually save you"
                className={inputCls}
              />
            </Field>

            <Field label="Web address" hint="Built from the title. Edit it only if you need to">
              <div className="flex items-center gap-2">
                <span className="flex-none text-sm text-gray-500">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }}
                  placeholder="service-intervals"
                  className={inputCls}
                />
              </div>
            </Field>

            <Field
              label="Standfirst"
              hint="One or two lines under the title. Left empty, the first paragraph is used."
            >
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={updateField('excerpt')}
                placeholder="A 500-hour oil change looks cheap until you count the downtime."
                className={`${inputCls} resize-none leading-relaxed`}
                maxLength={260}
              />
            </Field>

            <Field
              label="Body"
              required
              hint='Leave a blank line between paragraphs. Start a line with "## " for a subheading, or "- " for a bullet.'
            >
              <textarea
                rows={16}
                required
                value={form.body}
                onChange={updateField('body')}
                placeholder={
                  'Every operator asks the same question when the machine hits 5,000 hours.\n\n## What we actually check\n\n- Hydraulic oil and filters\n- Undercarriage wear\n\nThe short answer is that the interval is not the point…'
                }
                className={`${inputCls} resize-y font-mono text-sm leading-relaxed`}
              />
            </Field>

            <p className="text-sm text-gray-500">
              {form.body.trim() ? `${readingTime(form.body)} min read` : 'Nothing written yet'}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Author" hint="Shown in the byline">
                <input
                  type="text"
                  value={form.author}
                  onChange={updateField('author')}
                  placeholder="Dipu Kumar Singh"
                  className={inputCls}
                />
              </Field>
              <Field label="Tags" hint="Comma-separated">
                <input
                  type="text"
                  value={form.tags}
                  onChange={updateField('tags')}
                  placeholder="Maintenance, Excavators"
                  className={inputCls}
                />
              </Field>
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <span className="block text-sm font-semibold text-gray-800">Cover image</span>
              <span className="mt-1 block text-sm text-gray-500">
                Landscape works best. Cards are 4:3. Up to 10 MB.
              </span>
              <label
                className="relative mt-2 block cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#f37022] hover:bg-white"
                style={{ aspectRatio: '4 / 3' }}
              >
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
                {coverPreview || existingCover ? (
                  <>
                    <img
                      src={coverPreview || existingCover}
                      alt={coverPreview ? 'New cover preview' : 'Current cover'}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 text-sm text-white">
                      {coverPreview ? 'Click to replace' : 'Current cover · click to replace'}
                    </span>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f37022] text-white">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                        <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.5" fill="none" />
                      </svg>
                    </span>
                    <p className="text-base font-medium text-gray-700">Add a cover</p>
                    <p className="mt-1 text-sm text-gray-500">Optional. Posts work without one</p>
                  </div>
                )}
              </label>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={updateField('published')}
                  className="mt-1 h-4 w-4 accent-[#f37022]"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-800">
                    Publish this post
                  </span>
                  <span className="block text-sm text-gray-500">
                    Unticked, it stays a draft that only you can see.
                  </span>
                </span>
              </label>

              <div className="mt-5 space-y-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f37022] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#d95f15] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending'
                    ? 'Saving…'
                    : editingId
                      ? 'Save changes'
                      : form.published
                        ? 'Publish post'
                        : 'Save draft'}
                  <span aria-hidden>→</span>
                </button>
                {!form.published && (
                  <button
                    type="button"
                    onClick={() => submit(true)}
                    disabled={status === 'sending'}
                    className="w-full rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-60"
                  >
                    Save and publish now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <p className="text-base text-gray-500">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
          No posts yet. The form above writes the first one.
        </p>
      ) : (
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
            All posts · {posts.length}
          </h4>
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {posts.map((post) => {
              const isEditing = editingId === post.id
              return (
                <article
                  key={post.id}
                  className={`flex flex-wrap items-center gap-4 p-4 transition-colors ${
                    isEditing ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative h-16 w-24 flex-none overflow-hidden rounded-md bg-gray-100">
                    {post.cover ? (
                      <img
                        src={post.cover}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-semibold text-gray-900">
                        {post.title}
                      </p>
                      {post.published ? (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      /blog/{post.slug}
                      {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
                      {post.author ? ` · ${post.author}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublished(post)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => enterEdit(post)}
                      className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#f37022]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(post)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-post-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            style={{ animation: 'fade-up 0.2s ease-out both' }}
          >
            <h3 id="delete-post-title" className="text-lg font-bold text-gray-900">
              Delete this post?
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{deleteTarget.title}</span> and
              its text are removed for good. If you only want it off the public blog,
              unpublish it instead.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
