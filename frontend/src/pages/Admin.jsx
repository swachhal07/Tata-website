import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { products as seedProducts, orderByList } from '../data/products'

const CAT_OPTIONS = [
  { id: 'excavators', label: 'Excavators' },
  { id: 'mining',     label: 'Mining' },
  { id: 'backhoes',   label: 'Backhoe loaders' },
]

const DEFAULT_SPEC_LABELS = [
  'Operating weight',
  'Engine power',
  'Bucket capacity',
  'Max digging depth',
  'Fuel tank',
  'Track class',
]

const EMPTY_FORM = {
  code: '',
  name: '',
  cat: 'excavators',
  series: '',
  intro: '',
  applications: '',
  tags: '',
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

function SectionTitle({ children, action }) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-3 border-b border-gray-200 pb-2.5">
      <h3 className="text-xl font-bold text-gray-900">{children}</h3>
      {action}
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [authChecked, setAuthChecked] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [specs, setSpecs] = useState(
    DEFAULT_SPEC_LABELS.map((label) => ({ label, value: '' })),
  )
  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [existingPdf, setExistingPdf] = useState(null)
  const [editingCode, setEditingCode] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [overrides, setOverrides] = useState([])
  const [hiddenCodes, setHiddenCodes] = useState([])
  const [order, setOrder] = useState({})
  const [drag, setDrag] = useState(null) // { cat, index }
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const imgInputRef = useRef(null)
  const pdfInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!d.admin) {
          navigate('/login', { replace: true, state: { from: '/admin' } })
        } else {
          setAuthChecked(true)
        }
      })
      .catch(() => navigate('/login', { replace: true, state: { from: '/admin' } }))
  }, [navigate])

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) return
      const d = await res.json()
      setOverrides(Array.isArray(d.products) ? d.products : [])
      setHiddenCodes(Array.isArray(d.hidden) ? d.hidden : [])
      setOrder(d.order && typeof d.order === 'object' ? d.order : {})
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (authChecked) loadProducts()
  }, [authChecked, loadProducts])

  // Products grouped by category, each ordered by the saved drag order.
  // Rendered as draggable sections; `totalCount` drives the header count.
  const { groups, totalCount } = useMemo(() => {
    const overrideCodes = new Set(overrides.map((p) => p.code))
    const hidden = new Set(hiddenCodes)
    const visibleSeeds = seedProducts
      .filter((p) => !overrideCodes.has(p.code) && !hidden.has(p.code))
      .map((p) => ({ ...p, _source: 'seed' }))
    const dyn = overrides.map((p) => ({ ...p, _source: 'override' }))
    const merged = [...dyn, ...visibleSeeds]
    const knownCats = CAT_OPTIONS.map((c) => c.id)
    const cats = [...new Set([...knownCats, ...merged.map((p) => p.cat)])]
    const groups = cats
      .map((cat) => ({
        cat,
        label: CAT_OPTIONS.find((c) => c.id === cat)?.label || cat,
        items: orderByList(merged.filter((p) => p.cat === cat), order[cat] || []),
      }))
      .filter((g) => g.items.length > 0)
    return { groups, totalCount: merged.length }
  }, [overrides, hiddenCodes, order])

  const saveOrder = useCallback(
    async (cat, codes) => {
      try {
        const res = await fetch('/api/admin/order', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cat, codes }),
        })
        if (res.status === 401) {
          navigate('/login', { replace: true, state: { from: '/admin' } })
          return
        }
        if (!res.ok) throw new Error('Could not save order')
      } catch (err) {
        setError(err.message)
        loadProducts() // re-sync from server on failure
      }
    },
    [navigate, loadProducts],
  )

  // Drop the dragged card into `toIndex` within the same category, persist,
  // and optimistically update local order so the UI reflects it immediately.
  const handleDrop = (cat, toIndex) => {
    setDragOverIndex(null)
    if (!drag || drag.cat !== cat) {
      setDrag(null)
      return
    }
    const group = groups.find((g) => g.cat === cat)
    if (!group) {
      setDrag(null)
      return
    }
    const codes = group.items.map((p) => p.code)
    const from = drag.index
    if (from === toIndex) {
      setDrag(null)
      return
    }
    const [moved] = codes.splice(from, 1)
    codes.splice(toIndex, 0, moved)
    setOrder((prev) => ({ ...prev, [cat]: codes }))
    setDrag(null)
    saveOrder(cat, codes)
  }

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    if (!logoutOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !signingOut) setLogoutOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [logoutOpen, signingOut])

  useEffect(() => {
    if (!deleteTarget) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !deleting) setDeleteTarget(null)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [deleteTarget, deleting])

  const updateField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))
  const updateSpec = (i, key) => (e) =>
    setSpecs((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: e.target.value } : r)))
  const addSpec = () => setSpecs((rows) => [...rows, { label: '', value: '' }])
  const removeSpec = (i) =>
    setSpecs((rows) => rows.filter((_, idx) => idx !== i))

  const tagPreview = useMemo(
    () => form.applications.split(',').map((s) => s.trim()).filter(Boolean),
    [form.applications],
  )

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setSpecs(DEFAULT_SPEC_LABELS.map((label) => ({ label, value: '' })))
    setImageFile(null)
    setPdfFile(null)
    setExistingImage(null)
    setExistingPdf(null)
    setEditingCode(null)
    setError('')
    if (imgInputRef.current) imgInputRef.current.value = ''
    if (pdfInputRef.current) pdfInputRef.current.value = ''
  }

  const enterEdit = (product) => {
    setEditingCode(product.code)
    setForm({
      code: product.code || '',
      name: product.name || '',
      cat: product.cat || 'excavators',
      series: product.series || '',
      intro: product.intro || '',
      applications: (product.applications || []).join(', '),
      tags: (product.tags || []).join(', '),
    })
    const baseSpecs =
      product.specs && product.specs.length
        ? product.specs
        : DEFAULT_SPEC_LABELS.map((label) => ({ label, value: '' }))
    setSpecs(baseSpecs.map((s) => ({ label: s.label || '', value: s.value || '' })))
    setImageFile(null)
    setPdfFile(null)
    setExistingImage(typeof product.image === 'string' ? product.image : null)
    setExistingPdf(typeof product.pdf === 'string' ? product.pdf : null)
    setError('')
    setSuccess(null)
    if (imgInputRef.current) imgInputRef.current.value = ''
    if (pdfInputRef.current) pdfInputRef.current.value = ''
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const cancelEdit = () => resetForm()

  const confirmDelete = async () => {
    const product = deleteTarget
    if (!product) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(product.code)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.status === 401) {
        navigate('/login', { replace: true, state: { from: '/admin' } })
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not delete')
      }
      if (editingCode === product.code) resetForm()
      await loadProducts()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const restoreCode = async (code) => {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(code)}/restore`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Could not restore')
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.name.trim()) {
      setError('Code and name are required')
      return
    }
    setStatus('sending')
    setError('')
    setSuccess(null)

    try {
      const fd = new FormData()
      fd.append('code', form.code.trim())
      fd.append('name', form.name.trim())
      fd.append('cat', form.cat)
      fd.append('series', form.series.trim())
      fd.append('intro', form.intro.trim())
      fd.append('applications', form.applications)
      fd.append('tags', form.tags)
      fd.append(
        'specs',
        JSON.stringify(specs.filter((s) => s.label && s.value)),
      )
      if (imageFile) fd.append('image', imageFile)
      if (pdfFile) fd.append('pdf', pdfFile)

      const url = editingCode
        ? `/api/admin/products/${encodeURIComponent(editingCode)}`
        : '/api/admin/products'
      const method = editingCode ? 'PUT' : 'POST'

      const res = await fetch(url, { method, credentials: 'include', body: fd })
      if (res.status === 401) {
        navigate('/login', { replace: true, state: { from: '/admin' } })
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not save')

      setSuccess({ ...data.product, _wasEdit: !!editingCode })
      setStatus('idle')
      resetForm()
      await loadProducts()
    } catch (err) {
      setStatus('idle')
      setError(err.message)
    }
  }

  const confirmLogout = async () => {
    setSigningOut(true)
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    navigate('/login', { replace: true })
  }

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-base text-gray-500">Verifying session…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="block h-7 w-1 rounded-sm bg-[#f37022]" aria-hidden />
            <div>
              <p className="text-sm text-gray-500">Admin</p>
              <p className="text-base font-semibold text-gray-900">Tata Hitachi · Dugar</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              target="_blank"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-[#f37022] sm:block"
            >
              View catalogue ↗
            </Link>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Page intro */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-medium text-[#f37022]">
            {editingCode ? `Editing ${editingCode}` : 'Manage products'}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {editingCode ? 'Edit machine' : 'Catalogue'}
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-600">
            {editingCode
              ? 'Make your changes below. Saving updates the public catalogue immediately.'
              : 'Add new machines, or edit and remove anything in the catalogue. Changes go live instantly.'}
          </p>
        </div>
      </section>

      {/* Existing products */}
      <section className="border-b border-gray-200 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle>
            In the catalogue · {totalCount}
          </SectionTitle>

          <p className="-mt-2 mb-7 text-sm text-gray-500">
            Drag any card to reorder it within its category. The new order saves
            automatically and updates the public catalogue right away.
          </p>

          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group.cat}>
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                  {group.label} · {group.items.length}
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((p, idx) => {
                    const isEditing = editingCode === p.code
                    const isDragging = drag?.cat === group.cat && drag?.index === idx
                    const isDragOver =
                      drag?.cat === group.cat &&
                      dragOverIndex === idx &&
                      drag?.index !== idx
                    return (
                      <article
                        key={p.code}
                        draggable
                        onDragStart={(e) => {
                          setDrag({ cat: group.cat, index: idx })
                          e.dataTransfer.effectAllowed = 'move'
                        }}
                        onDragEnd={() => {
                          setDrag(null)
                          setDragOverIndex(null)
                        }}
                        onDragOver={(e) => {
                          if (drag?.cat === group.cat) {
                            e.preventDefault()
                            setDragOverIndex(idx)
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          handleDrop(group.cat, idx)
                        }}
                        title="Drag to reorder"
                        className={`flex cursor-grab gap-4 rounded-lg border bg-white p-4 transition-all active:cursor-grabbing ${
                          isEditing
                            ? 'border-[#f37022] ring-2 ring-[#f37022]/30'
                            : 'border-gray-200 hover:border-gray-400'
                        } ${isDragging ? 'opacity-40' : ''} ${
                          isDragOver ? 'ring-2 ring-[#f37022]/50' : ''
                        }`}
                      >
                        <div className="relative h-24 w-24 flex-none overflow-hidden rounded-md bg-gray-100">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                              No image
                            </div>
                          )}
                          {p._source === 'override' && (
                            <span className="absolute left-1.5 top-1.5 rounded bg-[#f37022] px-1.5 py-0.5 text-xs font-medium text-white">
                              Edited
                            </span>
                          )}
                          <span
                            className="absolute right-1.5 top-1.5 rounded bg-gray-900/85 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
                            title={`Position ${idx + 1} in ${group.label}`}
                          >
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm text-gray-500">{p.code}</p>
                            <span
                              aria-hidden
                              className="select-none text-base leading-none text-gray-300"
                            >
                              ⠿
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-base font-semibold text-gray-900">
                            {p.name}
                          </p>
                          <p className="mt-0.5 truncate text-sm text-gray-500">
                            {group.label}
                          </p>
                          <div className="mt-auto flex items-center gap-2 pt-3">
                            <button
                              type="button"
                              onClick={() => enterEdit(p)}
                              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#f37022]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(p)}
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
              </div>
            ))}
          </div>

          {hiddenCodes.length > 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-5">
              <p className="text-sm font-semibold text-gray-700">
                Hidden from catalogue · {hiddenCodes.length}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {hiddenCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => restoreCode(code)}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
                  >
                    {code}
                    <span aria-hidden>↺</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Click any code to restore it to the public catalogue.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section className="py-10" ref={formRef}>
        <div className="mx-auto max-w-6xl px-6">
          {success && (
            <div className="mb-8 flex items-start gap-3 rounded-lg border border-[#f37022]/30 bg-orange-50 p-4">
              <div className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#f37022] text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[3]" aria-hidden>
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#a4360c]">
                  {success._wasEdit ? 'Updated' : 'Saved'} · {success.code}
                </p>
                <p className="mt-0.5 text-base font-semibold text-gray-900">
                  {success.name} is {success._wasEdit ? 'updated' : 'now in the catalogue'}.
                </p>
                <Link
                  to="/products"
                  target="_blank"
                  className="mt-1.5 inline-block text-sm font-medium text-gray-700 underline-offset-4 hover:text-[#f37022] hover:underline"
                >
                  Open on the public site ↗
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingCode ? 'Edit details' : 'Add a machine'}
            </h2>
            {editingCode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-[#f37022]"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form
            onSubmit={submit}
            className="grid grid-cols-1 gap-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:p-10"
          >
            {/* LEFT — fields */}
            <div className="space-y-9">
              <div>
                <SectionTitle>Identity</SectionTitle>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Model code" required hint="A unique ID, e.g. ZAXIS-220LC">
                    <input
                      type="text"
                      required
                      value={form.code}
                      onChange={updateField('code')}
                      placeholder="ZAXIS-220LC"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Display name" required hint="Shown on the catalogue">
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={updateField('name')}
                      placeholder="ZAXIS 220 LC"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Category" required>
                    <div className="flex flex-wrap gap-2">
                      {CAT_OPTIONS.map((c) => {
                        const active = form.cat === c.id
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, cat: c.id }))}
                            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                              active
                                ? 'border-[#f37022] bg-[#f37022] text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                            }`}
                          >
                            {c.label}
                          </button>
                        )
                      })}
                    </div>
                  </Field>
                  <Field label="Series tag" hint="e.g. Medium excavator · Long crawler">
                    <input
                      type="text"
                      value={form.series}
                      onChange={updateField('series')}
                      placeholder="Medium excavator · Long crawler"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              <div>
                <SectionTitle>Description</SectionTitle>
                <Field label="Intro paragraph" hint="Shown above the spec sheet">
                  <textarea
                    rows={4}
                    value={form.intro}
                    onChange={updateField('intro')}
                    placeholder="The site workhorse. Extended undercarriage for stability on uneven ground…"
                    className={`${inputCls} resize-none leading-relaxed`}
                    maxLength={400}
                  />
                </Field>
                <p className="mt-1 text-right text-sm text-gray-400">{form.intro.length}/400</p>
              </div>

              <div>
                <SectionTitle
                  action={
                    <button
                      type="button"
                      onClick={addSpec}
                      className="text-sm font-medium text-[#f37022] hover:text-gray-900"
                    >
                      + Add row
                    </button>
                  }
                >
                  Spec sheet
                </SectionTitle>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_1fr_auto] items-stretch border-b border-gray-200 last:border-b-0"
                    >
                      <input
                        type="text"
                        value={s.label}
                        onChange={updateSpec(i, 'label')}
                        placeholder="Operating weight"
                        className="border-r border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={s.value}
                        onChange={updateSpec(i, 'value')}
                        placeholder="22.4 t"
                        className="border-r border-gray-200 bg-white px-4 py-3 text-base tabular-nums text-gray-900 placeholder:text-gray-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="bg-white px-4 text-xl text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove row"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle>Tags</SectionTitle>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Applications" hint="Comma-separated. Shown as pills under the spec table.">
                    <input
                      type="text"
                      value={form.applications}
                      onChange={updateField('applications')}
                      placeholder="Infrastructure, Road construction, Hydropower"
                      className={inputCls}
                    />
                    {tagPreview.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tagPreview.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-[#f37022]/30 bg-orange-50 px-2 py-0.5 text-sm font-medium text-[#a4360c]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Field>
                  <Field label="Cross-category tags" hint='Use "mining" to also show in the Mining tab.'>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={updateField('tags')}
                      placeholder="mining"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* RIGHT — media + submit */}
            <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              <div>
                <SectionTitle>Media</SectionTitle>

                <label
                  className="relative block cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#f37022] hover:bg-white"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 text-sm text-white">
                        Click to replace
                      </span>
                    </>
                  ) : existingImage ? (
                    <>
                      <img
                        src={existingImage}
                        alt="Current"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2.5 py-1 text-sm text-white">
                        Current image · click to replace
                      </span>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f37022] text-white">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                          <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.5" fill="none" />
                        </svg>
                      </span>
                      <p className="text-base font-medium text-gray-700">
                        Add a machine image
                      </p>
                      <p className="mt-1 text-sm text-gray-500">JPG / PNG / WebP · up to 12 MB</p>
                    </div>
                  )}
                </label>
                {imageFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    {imageFile.name} · {(imageFile.size / 1024).toFixed(0)} KB
                  </p>
                )}

                <div className="mt-5">
                  <Field label="Brochure PDF" hint="Optional — shown when buyers click 'View brochure'.">
                    <div className="flex items-center gap-3">
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        id="pdf-input"
                      />
                      <label
                        htmlFor="pdf-input"
                        className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#f37022] hover:text-[#f37022]"
                      >
                        Choose file
                      </label>
                      <span className="truncate text-sm text-gray-500">
                        {pdfFile
                          ? pdfFile.name
                          : existingPdf
                          ? 'Keep existing PDF'
                          : 'No file selected'}
                      </span>
                    </div>
                  </Field>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {error && (
                  <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f37022] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#d95f15] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending'
                    ? editingCode
                      ? 'Updating…'
                      : 'Saving…'
                    : editingCode
                    ? 'Update machine'
                    : 'Add to catalogue'}
                  <span aria-hidden>→</span>
                </button>
                <p className="mt-2 text-center text-sm text-gray-500">
                  Goes live instantly. No rebuild needed.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !signingOut && setLogoutOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            style={{ animation: 'fade-up 0.2s ease-out both' }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-100 text-[#f37022]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M15 4v2H5v12h10v2H3V4h12Zm4.293 4.293 4 4-4 4-1.414-1.414L20.172 12H9v-2h11.172l-2.293-2.293 1.414-1.414Z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 id="logout-title" className="text-lg font-bold text-gray-900">
                  Sign out of the console?
                </h3>
                <p className="mt-1.5 text-sm text-gray-600">
                  You'll need to enter the admin email and password again to make
                  more changes. Your work in the form will be lost.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                disabled={signingOut}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-60"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={signingOut}
                className="rounded-md bg-[#f37022] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#d95f15] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            style={{ animation: 'fade-up 0.2s ease-out both' }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M9 3h6l1 2h5v2H3V5h5l1-2Zm-3 6h12l-1 12H7L6 9Zm4 2v8h1v-8h-1Zm3 0v8h1v-8h-1Z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 id="delete-title" className="text-lg font-bold text-gray-900">
                  Remove this machine?
                </h3>
                <p className="mt-1.5 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{deleteTarget.name}</span>{' '}
                  <span className="text-gray-500">({deleteTarget.code})</span> will be taken off
                  the public catalogue right away. You can restore it later from this page.
                </p>
              </div>
            </div>
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
    </main>
  )
}
