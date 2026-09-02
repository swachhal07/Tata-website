import { useEffect, useRef, useState } from 'react'

/**
 * Full-screen brochure reader. Renders the PDF inline with the browser's own
 * viewer (page nav, zoom, search, print) so buyers stay on the site instead of
 * being pushed to a new tab, with explicit download / new-tab escape hatches.
 */
export default function BrochureViewer({ url, title, code, onClose }) {
  const [failed, setFailed] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Some mobile browsers (iOS Safari in particular) refuse to render a PDF in
  // an iframe and leave it blank. Fall back to a plain open/download prompt.
  const embeddable =
    typeof navigator === 'undefined' ||
    !/iPad|iPhone|iPod|Android/i.test(navigator.userAgent)

  const filename = `${(code || title || 'brochure').replace(/[^a-zA-Z0-9-]+/g, '-')}.pdf`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} brochure`}
      className="fixed inset-0 z-50 flex flex-col bg-black/80 p-2 sm:p-4 md:p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-full w-full max-w-[1400px] flex-col overflow-hidden border-t-4 border-[#f37022] bg-white"
      >
        {/* ─── Toolbar ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tabular-nums tracking-tight text-[#f37022]">
              / Brochure{code ? ` · ${code}` : ''}
            </p>
            <h2 className="truncate text-sm font-black uppercase tracking-tight text-black sm:text-base">
              {title}
            </h2>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 transition-colors hover:text-black"
          >
            Open in new tab
          </a>
          <a
            href={url}
            download={filename}
            className="bg-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#f37022]"
          >
            Download
          </a>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close brochure"
            className="text-2xl leading-none text-gray-500 transition-colors hover:text-black"
          >
            ×
          </button>
        </div>

        {/* ─── The PDF ─────────────────────────────────────────── */}
        <div className="min-h-0 flex-1 bg-gray-100">
          {embeddable && !failed ? (
            <iframe
              src={url}
              title={`${title} brochure`}
              onError={() => setFailed(true)}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                Your browser can't show the PDF inline. Open it in a new tab or
                download it to read the full brochure.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#f37022]"
              >
                Open brochure
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
