import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminShell from '../components/AdminShell'

const KINDS = [
  { id: 'service', label: 'Service & spare centre' },
  { id: 'sales', label: 'Sales representative' },
]

const LABEL_PRESETS = ['Service & Parts', 'Service', 'Parts', 'Sales', 'Showroom']

const OFFSETS = [
  { id: 'up', label: 'Above pin' },
  { id: 'down', label: 'Below pin' },
  { id: 'left', label: 'Left of pin' },
  { id: 'right', label: 'Right of pin' },
]

const EMPTY_FORM = {
  kind: 'service',
  city: '',
  label: 'Service & Parts',
  contact: '',
  phone: '',
  mapUrl: '',
  labelOffset: 'down',
  showOnMap: true,
}

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

export default function AdminLocations() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/locations')
      if (!res.ok) throw new Error('Could not load locations')
      const d = await res.json()
      setLocations(Array.isArray(d.locations) ? d.locations : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // AdminShell has already verified the session before this mounts.
  useEffect(() => {
    let cancelled = false
    fetch('/api/locations')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load locations'))))
      .then((d) => {
        if (cancelled) return
        setLocations(Array.isArray(d.locations) ? d.locations : [])
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
      service: locations.filter((l) => l.kind === 'service'),
      sales: locations.filter((l) => l.kind === 'sales'),
    }),
    [locations],
  )

  const mapCount = locations.filter(
    (l) => l.showOnMap && typeof l.lat === 'number' && typeof l.lng === 'number',
  ).length

  const updateField = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError('')
  }

  const enterEdit = (loc) => {
    setEditingId(loc.id)
    setForm({
      kind: loc.kind === 'sales' ? 'sales' : 'service',
      city: loc.city || '',
      label: loc.label || '',
      contact: loc.contact || '',
      phone: loc.phone || '',
      mapUrl: loc.mapUrl || '',
      labelOffset: loc.labelOffset || 'down',
      showOnMap: !!loc.showOnMap,
    })
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.city.trim()) {
      setError('City is required')
      return
    }
    setStatus('sending')
    setError('')
    setSuccess('')
    try {
      const url = editingId
        ? `/api/admin/locations/${encodeURIComponent(editingId)}`
        : '/api/admin/locations'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.status === 401) {
        navigate('/login', { replace: true, state: { from: '/admin/locations' } })
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not save')
      const saved = data.location
      const noCoords = form.showOnMap && typeof saved?.lat !== 'number'
      setSuccess(
        `${saved?.city || form.city} ${editingId ? 'updated' : 'added'}. Live on the contact page now.` +
          (noCoords
            ? " We couldn't read coordinates from that Maps link, so it has no map pin yet. Open the branch in Google Maps, copy the link from the browser address bar, and save again."
            : ''),
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
      const res = await fetch(
        `/api/admin/locations/${encodeURIComponent(deleteTarget.id)}`,
        { method: 'DELETE', credentials: 'include' },
      )
      if (res.status === 401) {
        navigate('/login', { replace: true, state: { from: '/admin/locations' } })
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

  // Move one entry up or down and persist the whole order.
  const move = async (loc, delta) => {
    const ids = locations.map((l) => l.id)
    const from = ids.indexOf(loc.id)
    const to = from + delta
    if (from < 0 || to < 0 || to >= ids.length) return
    const next = locations.slice()
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setLocations(next) // optimistic
    try {
      const res = await fetch('/api/admin/locations-order', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map((l) => l.id) }),
      })
      if (!res.ok) throw new Error('Could not save the new order')
    } catch (err) {
      setError(err.message)
      load() // re-sync from the server
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((loc) => {
            const isEditing = editingId === loc.id
            const index = locations.indexOf(loc)
            return (
              <article
                key={loc.id}
                className={`flex flex-col rounded-lg border bg-white p-4 transition-colors ${
                  isEditing
                    ? 'border-[#f37022] ring-2 ring-[#f37022]/30'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold text-gray-900">{loc.city}</p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(loc, -1)}
                      disabled={index === 0}
                      className="rounded border border-gray-200 px-1.5 text-sm text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-30"
                      aria-label={`Move ${loc.city} earlier`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(loc, 1)}
                      disabled={index === locations.length - 1}
                      className="rounded border border-gray-200 px-1.5 text-sm text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-30"
                      aria-label={`Move ${loc.city} later`}
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{loc.label}</p>
                {loc.contact && (
                  <p className="mt-2 text-sm text-gray-700">{loc.contact}</p>
                )}
                {loc.phone && (
                  <p className="text-sm tabular-nums text-gray-500">{loc.phone}</p>
                )}
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  {loc.mapUrl ? (
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-600 underline underline-offset-4 transition-colors hover:text-[#f37022]"
                    >
                      Open in Maps ↗
                    </a>
                  ) : (
                    <span className="text-gray-500">No map link</span>
                  )}
                  {loc.showOnMap ? (
                    <span className="rounded bg-[#f37022]/10 px-1.5 py-0.5 font-medium text-[#a4360c]">
                      On map
                    </span>
                  ) : (
                    loc.mapUrl && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-700">
                        Not pinned
                      </span>
                    )
                  )}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => enterEdit(loc)}
                    className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#f37022]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(loc)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    Remove
                  </button>
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
      eyebrow={editingId ? 'Editing a location' : 'Branch network'}
      title="Locations"
      description="Add a branch, update a phone number, or drop a pin on the network map. Everything here appears on the public contact page instantly, with no rebuild needed."
      meta={`${locations.length} locations · ${mapCount} shown on the map`}
      actions={
        <Link
          to="/contact"
          target="_blank"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
        >
          View contact page ↗
        </Link>
      }
    >
      <section>
        <div>
          {success && (
            <p className="mb-6 rounded-lg border border-[#f37022]/30 bg-orange-50 px-4 py-3 text-sm font-medium text-[#a4360c]">
              {success}
            </p>
          )}

          <form
            onSubmit={submit}
            className="mb-12 rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit location' : 'Add a location'}
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

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Type" required>
                <div className="flex flex-wrap gap-2">
                  {KINDS.map((k) => {
                    const active = form.kind === k.id
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            kind: k.id,
                            label:
                              f.label && f.label !== 'Sales' && f.label !== 'Service & Parts'
                                ? f.label
                                : k.id === 'sales'
                                  ? 'Sales'
                                  : 'Service & Parts',
                          }))
                        }
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

              <Field label="City / branch" required hint="Shown as the card heading">
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={updateField('city')}
                  placeholder="Itahari"
                  className={inputCls}
                />
              </Field>

              <Field label="What it covers" hint="e.g. Service & Parts, Sales">
                <input
                  type="text"
                  list="location-labels"
                  value={form.label}
                  onChange={updateField('label')}
                  placeholder="Service & Parts"
                  className={inputCls}
                />
                <datalist id="location-labels">
                  {LABEL_PRESETS.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </Field>

              <Field label="Contact person">
                <input
                  type="text"
                  value={form.contact}
                  onChange={updateField('contact')}
                  placeholder="Rahul Kumar Jha"
                  className={inputCls}
                />
              </Field>

              <Field label="Phone" hint="Nepal mobile, digits only, e.g. 9802573217">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  placeholder="9802573217"
                  className={inputCls}
                />
              </Field>

              <div className="md:col-span-2">
                <Field
                  label="Google Maps link"
                  hint="Open the branch in Google Maps, tap Share → Copy link, and paste it here. We read the coordinates from the link so the map pin lands in the right place."
                >
                  <input
                    type="url"
                    value={form.mapUrl}
                    onChange={updateField('mapUrl')}
                    placeholder="https://maps.app.goo.gl/…"
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            <label className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.showOnMap}
                onChange={updateField('showOnMap')}
                className="mt-1 h-4 w-4 accent-[#f37022]"
              />
              <span>
                <span className="block text-sm font-semibold text-gray-800">
                  Show a pin on the network map
                </span>
                <span className="block text-sm text-gray-500">
                  Needs a Google Maps link we can read coordinates from. Leave
                  off for a representative who works out of an existing branch.
                </span>
              </span>
            </label>

            {/* Only matters for a pinned branch - it keeps the city name clear
                of neighbouring pins on the map. */}
            {form.showOnMap && (
              <div className="mt-5 max-w-sm">
                <Field
                  label="City name sits"
                  hint="Move it if the label overlaps a nearby branch on the map"
                >
                  <select
                    value={form.labelOffset}
                    onChange={updateField('labelOffset')}
                    className={inputCls}
                  >
                    {OFFSETS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            {error && (
              <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-[#f37022] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#d95f15] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending'
                ? 'Saving…'
                : editingId
                  ? 'Update location'
                  : 'Add location'}
              <span aria-hidden>→</span>
            </button>
          </form>

          {loading ? (
            <p className="text-base text-gray-500">Loading locations…</p>
          ) : (
            <div className="space-y-10">
              {renderGroup(
                'Service & spare',
                groups.service,
                'No service centres yet. Add the first one above.',
              )}
              {renderGroup(
                'Sales team',
                groups.sales,
                'No sales representatives yet. Add the first one above.',
              )}
            </div>
          )}
        </div>
      </section>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-location-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            style={{ animation: 'fade-up 0.2s ease-out both' }}
          >
            <h3 id="delete-location-title" className="text-lg font-bold text-gray-900">
              Remove this location?
            </h3>
            <p className="mt-1.5 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{deleteTarget.city}</span>{' '}
              <span className="text-gray-500">({deleteTarget.label})</span> comes off
              the contact page and the map right away. This one can't be undone.
              you'd need to add it again.
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
