import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import { photoFor } from '../data/people'

const KINDS = [
  { id: 'board', label: 'Board of Directors' },
  { id: 'management', label: 'Management Team' },
]

const EMPTY_FORM = { kind: 'board', name: '', role: '' }

const inputCls =
  'block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#f37022] focus:outline-none focus:ring-2 focus:ring-[#f37022]/20'

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

export default function AdminPeople() {
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [existingPhoto, setExistingPhoto] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const photoInputRef = useRef(null)
  const formRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/people')
      if (!res.ok) throw new Error('Could not load the team')
      const d = await res.json()
      setPeople(Array.isArray(d.people) ? d.people : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // AdminShell has already verified the session before this mounts.
  useEffect(() => {
    let cancelled = false
    fetch('/api/people')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load the team'))))
      .then((d) => {
        if (cancelled) return
        setPeople(Array.isArray(d.people) ? d.people : [])
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

  // Derived, not state - so picking a file doesn't cost an extra render.
  const photoPreview = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : null),
    [photoFile],
  )
  useEffect(() => {
    if (!photoPreview) return
    return () => URL.revokeObjectURL(photoPreview)
  }, [photoPreview])

  useEffect(() => {
    if (!deleteTarget) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !deleting) setDeleteTarget(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteTarget, deleting])

  const groups = useMemo(
    () => ({
      board: people.filter((p) => p.kind === 'board'),
      management: people.filter((p) => p.kind === 'management'),
    }),
    [people],
  )

  const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setPhotoFile(null)
    setExistingPhoto(null)
    setError('')
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const enterEdit = (person) => {
    setEditingId(person.id)
    setForm({
      kind: person.kind === 'management' ? 'management' : 'board',
      name: person.name || '',
      role: person.role || '',
    })
    setPhotoFile(null)
    setExistingPhoto(photoFor(person))
    setError('')
    setSuccess('')
    if (photoInputRef.current) photoInputRef.current.value = ''
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    setStatus('sending')
    setError('')
    setSuccess('')
    try {
      const fd = new FormData()
      fd.append('kind', form.kind)
      fd.append('name', form.name.trim())
      fd.append('role', form.role.trim())
      if (photoFile) fd.append('photo', photoFile)

      const res = await fetch(
        editingId ? `/api/admin/people/${encodeURIComponent(editingId)}` : '/api/admin/people',
        { method: editingId ? 'PUT' : 'POST', credentials: 'include', body: fd },
      )
      if (res.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not save')
      setSuccess(
        `${data.person?.name || form.name} ${editingId ? 'updated' : 'added'}. Live on the leadership page now.`,
      )
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
      const res = await fetch(`/api/admin/people/${encodeURIComponent(deleteTarget.id)}`, {
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

  // Move one person up or down and persist the whole order.
  const move = async (person, delta) => {
    const from = people.indexOf(person)
    const to = from + delta
    if (from < 0 || to < 0 || to >= people.length) return
    const next = people.slice()
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setPeople(next) // optimistic
    try {
      const res = await fetch('/api/admin/people-order', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map((p) => p.id) }),
      })
      if (!res.ok) throw new Error('Could not save the new order')
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  const renderGroup = (title, items, emptyNote) => (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
        {title} · {items.length}
      </h4>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
          {emptyNote}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((person) => {
            const isEditing = editingId === person.id
            const index = people.indexOf(person)
            const photo = photoFor(person)
            return (
              <article
                key={person.id}
                className={`flex gap-4 rounded-lg border bg-white p-4 transition-colors ${
                  isEditing
                    ? 'border-[#f37022] ring-2 ring-[#f37022]/30'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="relative h-24 w-20 flex-none overflow-hidden rounded-md bg-gray-100">
                  {photo ? (
                    <img
                      src={photo}
                      alt={person.name}
                      className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No photo
                    </div>
                  )}
                  {!person.photo && photo && (
                    <span className="absolute inset-x-0 bottom-0 bg-gray-900/80 py-0.5 text-center text-xs text-white">
                      Bundled
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-base font-semibold text-gray-900">
                      {person.name}
                    </p>
                    <div className="flex flex-none items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(person, -1)}
                        disabled={index === 0}
                        className="rounded border border-gray-200 px-1.5 text-sm text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-30"
                        aria-label={`Move ${person.name} earlier`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(person, 1)}
                        disabled={index === people.length - 1}
                        className="rounded border border-gray-200 px-1.5 text-sm text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-30"
                        aria-label={`Move ${person.name} later`}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-500">{person.role}</p>
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => enterEdit(person)}
                      className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#f37022]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(person)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <AdminShell
      eyebrow={editingId ? 'Editing a profile' : 'Leadership'}
      title="Team"
      description="Board of directors and management team, as shown on the leadership page. Change a photo, fix a title, or add someone new."
      meta={`${groups.board.length} directors · ${groups.management.length} management`}
      actions={
        <Link
          to="/leadership"
          target="_blank"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
        >
          View leadership page ↗
        </Link>
      }
    >
      {success && (
        <p className="mb-6 rounded-lg border border-[#f37022]/30 bg-orange-50 px-4 py-3 text-sm font-medium text-[#a4360c]">
          {success}
        </p>
      )}

      <form
        ref={formRef}
        onSubmit={submit}
        className="mb-12 scroll-mt-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId ? 'Edit profile' : 'Add someone'}
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div className="space-y-5">
            <Field label="Section" required>
              <div className="flex flex-wrap gap-2">
                {KINDS.map((k) => {
                  const active = form.kind === k.id
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, kind: k.id }))}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? 'border-[#f37022] bg-[#f37022] text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                      }`}
                    >
                      {k.label}
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field label="Full name" required hint="Shown as first name over surname">
              <input
                type="text"
                required
                value={form.name}
                onChange={updateField('name')}
                placeholder="Niraj Sapkota"
                className={inputCls}
              />
            </Field>

            <Field label="Role" hint="e.g. Chairman, Head of After Sales">
              <input
                type="text"
                value={form.role}
                onChange={updateField('role')}
                placeholder="Business Head"
                className={inputCls}
              />
            </Field>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f37022] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#d95f15] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Saving…' : editingId ? 'Update profile' : 'Add to the team'}
              <span aria-hidden>→</span>
            </button>
          </div>

          <div>
            <span className="block text-sm font-semibold text-gray-800">Portrait</span>
            <span className="mt-1 block text-sm text-gray-500">
              Upright photo works best. Cards are 3:4. Up to 10 MB.
            </span>
            <label
              className="relative mt-2 block cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#f37022] hover:bg-white"
              style={{ aspectRatio: '3 / 4' }}
            >
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
              {photoPreview || existingPhoto ? (
                <>
                  <img
                    src={photoPreview || existingPhoto}
                    alt={photoPreview ? 'New portrait preview' : 'Current portrait'}
                    className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
                  />
                  <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 text-sm text-white">
                    {photoPreview ? 'Click to replace' : 'Current photo · click to replace'}
                  </span>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f37022] text-white">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    </svg>
                  </span>
                  <p className="text-base font-medium text-gray-700">Add a portrait</p>
                  <p className="mt-1 text-sm text-gray-500">JPG / PNG / WebP</p>
                </div>
              )}
            </label>
            {photoFile && (
              <p className="mt-2 text-sm text-gray-500">
                {photoFile.name} · {(photoFile.size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>
        </div>
      </form>

      {loading ? (
        <p className="text-base text-gray-500">Loading the team…</p>
      ) : (
        <div className="space-y-10">
          {renderGroup(
            'Board of Directors',
            groups.board,
            'No directors yet. Add the first one above.',
          )}
          {renderGroup(
            'Management Team',
            groups.management,
            'No management profiles yet. Add the first one above.',
          )}
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-person-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            style={{ animation: 'fade-up 0.2s ease-out both' }}
          >
            <h3 id="delete-person-title" className="text-lg font-bold text-gray-900">
              Remove this profile?
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{deleteTarget.name}</span>{' '}
              <span className="text-gray-500">({deleteTarget.role})</span> comes off the
              leadership page right away. This one can't be undone. You'd need to add
              them again.
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
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
