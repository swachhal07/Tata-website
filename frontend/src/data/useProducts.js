import { useEffect, useMemo, useState } from 'react'
import { products as seedProducts } from './products'

/* Shared product loader.
 *
 * The catalogue is admin-managed (`GET /api/products`) with the bundled
 * `seedProducts` as the fallback, and both the listing page and the detail
 * pages need the same merged view. `ready` distinguishes "still fetching"
 * from "fetched, and this machine genuinely does not exist" — the detail
 * page needs that to avoid flashing a 404 before the request lands.
 */
export default function useProducts() {
  const [dynamicProducts, setDynamicProducts] = useState([])
  const [hiddenCodes, setHiddenCodes] = useState([])
  const [order, setOrder] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return
        if (d) {
          if (Array.isArray(d.products)) setDynamicProducts(d.products)
          if (Array.isArray(d.hidden)) setHiddenCodes(d.hidden)
          if (d.order && typeof d.order === 'object') setOrder(d.order)
        }
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const products = useMemo(() => {
    const overrideCodes = new Set(dynamicProducts.map((p) => p.code))
    const hidden = new Set(hiddenCodes)
    const visibleSeeds = seedProducts.filter(
      (p) => !overrideCodes.has(p.code) && !hidden.has(p.code),
    )
    return [...dynamicProducts, ...visibleSeeds]
  }, [dynamicProducts, hiddenCodes])

  return { products, order, ready }
}
