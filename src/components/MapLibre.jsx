import MapLibreGL from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Minus, Plus, Locate, Maximize, Loader2 } from 'lucide-react'

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

const defaultStyles = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}

function getDocumentTheme() {
  if (typeof document === 'undefined') return null
  if (document.documentElement.classList.contains('dark')) return 'dark'
  if (document.documentElement.classList.contains('light')) return 'light'
  return null
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedTheme(themeProp) {
  const [detectedTheme, setDetectedTheme] = useState(
    () => getDocumentTheme() ?? getSystemTheme()
  )

  useEffect(() => {
    if (themeProp) return

    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme()
      if (docTheme) setDetectedTheme(docTheme)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e) => {
      if (!getDocumentTheme()) setDetectedTheme(e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleSystemChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleSystemChange)
    }
  }, [themeProp])

  return themeProp ?? detectedTheme
}

const MapContext = createContext(null)

export function useMap() {
  const context = useContext(MapContext)
  if (!context) throw new Error('useMap must be used within a Map component')
  return context
}

function getViewport(map) {
  const center = map.getCenter()
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  }
}

function DefaultLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export const Map = forwardRef(function Map(
  {
    children,
    className,
    theme: themeProp,
    styles,
    projection,
    viewport,
    onViewportChange,
    loading = false,
    ...props
  },
  ref
) {
  const containerRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)
  const currentStyleRef = useRef(null)
  const styleTimeoutRef = useRef(null)
  const internalUpdateRef = useRef(false)
  const resolvedTheme = useResolvedTheme(themeProp)

  const isControlled = viewport !== undefined && onViewportChange !== undefined

  const onViewportChangeRef = useRef(onViewportChange)
  onViewportChangeRef.current = onViewportChange

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles]
  )

  useImperativeHandle(ref, () => mapInstance, [mapInstance])

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current)
      styleTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const initialStyle =
      resolvedTheme === 'dark' ? mapStyles.dark : mapStyles.light
    currentStyleRef.current = initialStyle

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: { compact: true },
      ...props,
      ...viewport,
    })

    const styleDataHandler = () => {
      clearStyleTimeout()
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true)
        if (projection) map.setProjection(projection)
      }, 100)
    }
    const loadHandler = () => setIsLoaded(true)

    const handleMove = () => {
      if (internalUpdateRef.current) return
      onViewportChangeRef.current?.(getViewport(map))
    }

    map.on('load', loadHandler)
    map.on('styledata', styleDataHandler)
    map.on('move', handleMove)
    setMapInstance(map)

    return () => {
      clearStyleTimeout()
      map.off('load', loadHandler)
      map.off('styledata', styleDataHandler)
      map.off('move', handleMove)
      map.remove()
      setIsLoaded(false)
      setIsStyleLoaded(false)
      setMapInstance(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) return
    if (mapInstance.isMoving()) return

    const current = getViewport(mapInstance)
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    }

    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    ) {
      return
    }

    internalUpdateRef.current = true
    mapInstance.jumpTo(next)
    internalUpdateRef.current = false
  }, [mapInstance, isControlled, viewport])

  useEffect(() => {
    if (!mapInstance || !resolvedTheme) return
    const newStyle =
      resolvedTheme === 'dark' ? mapStyles.dark : mapStyles.light
    if (currentStyleRef.current === newStyle) return
    clearStyleTimeout()
    currentStyleRef.current = newStyle
    setIsStyleLoaded(false)
    mapInstance.setStyle(newStyle, { diff: true })
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout])

  const contextValue = useMemo(
    () => ({ map: mapInstance, isLoaded: isLoaded && isStyleLoaded }),
    [mapInstance, isLoaded, isStyleLoaded]
  )

  return (
    <MapContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn('relative h-full w-full', className)}
      >
        {(!isLoaded || loading) && <DefaultLoader />}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  )
})

const MarkerContext = createContext(null)

function useMarkerContext() {
  const context = useContext(MarkerContext)
  if (!context) throw new Error('Marker components must be used within MapMarker')
  return context
}

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  draggable = false,
  ...markerOptions
}) {
  const { map } = useMap()

  const callbacksRef = useRef({ onClick, onMouseEnter, onMouseLeave })
  callbacksRef.current = { onClick, onMouseEnter, onMouseLeave }

  const marker = useMemo(() => {
    const markerInstance = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement('div'),
      draggable,
    }).setLngLat([longitude, latitude])

    const handleClick = (e) => callbacksRef.current.onClick?.(e)
    const handleMouseEnter = (e) => callbacksRef.current.onMouseEnter?.(e)
    const handleMouseLeave = (e) => callbacksRef.current.onMouseLeave?.(e)

    markerInstance.getElement()?.addEventListener('click', handleClick)
    markerInstance.getElement()?.addEventListener('mouseenter', handleMouseEnter)
    markerInstance.getElement()?.addEventListener('mouseleave', handleMouseLeave)

    return markerInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return
    marker.addTo(map)
    return () => marker.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (
    marker.getLngLat().lng !== longitude ||
    marker.getLngLat().lat !== latitude
  ) {
    marker.setLngLat([longitude, latitude])
  }

  return (
    <MarkerContext.Provider value={{ marker, map }}>
      {children}
    </MarkerContext.Provider>
  )
}

function DefaultMarkerIcon() {
  return (
    <div className="relative">
      <div className="absolute inset-0 animate-ping rounded-full bg-[#f37022] opacity-50" />
      <div className="relative h-4 w-4 rounded-full border-2 border-white bg-[#f37022] shadow-lg" />
    </div>
  )
}

export function MarkerContent({ children, className }) {
  const { marker } = useMarkerContext()
  return createPortal(
    <div className={cn('relative cursor-pointer', className)}>
      {children || <DefaultMarkerIcon />}
    </div>,
    marker.getElement()
  )
}

const controlPositionClasses = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-10 right-2',
}

function ControlGroup({ children }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-gray-200">
      {children}
    </div>
  )
}

function ControlButton({ onClick, label, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      type="button"
      className={cn(
        'flex h-8 w-8 items-center justify-center transition-colors',
        'first:rounded-t-md last:rounded-b-md',
        'text-gray-700 hover:bg-gray-100 hover:text-black',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f37022]',
        'disabled:pointer-events-none disabled:opacity-50'
      )}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function MapControls({
  position = 'bottom-right',
  showZoom = true,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}) {
  const { map } = useMap()
  const [waitingForLocation, setWaitingForLocation] = useState(false)

  const handleZoomIn = useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 })
  }, [map])

  const handleZoomOut = useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 })
  }, [map])

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          }
          map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          })
          onLocate?.(coords)
          setWaitingForLocation(false)
        },
        () => setWaitingForLocation(false)
      )
    }
  }, [map, onLocate])

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer()
    if (!container) return
    if (document.fullscreenElement) document.exitFullscreen()
    else container.requestFullscreen()
  }, [map])

  return (
    <div
      className={cn(
        'absolute z-10 flex flex-col gap-1.5',
        controlPositionClasses[position],
        className
      )}
    >
      {showZoom && (
        <ControlGroup>
          <ControlButton onClick={handleZoomIn} label="Zoom in">
            <Plus className="h-4 w-4" />
          </ControlButton>
          <ControlButton onClick={handleZoomOut} label="Zoom out">
            <Minus className="h-4 w-4" />
          </ControlButton>
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton
            onClick={handleLocate}
            label="Find my location"
            disabled={waitingForLocation}
          >
            {waitingForLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Locate className="h-4 w-4" />
            )}
          </ControlButton>
        </ControlGroup>
      )}
      {showFullscreen && (
        <ControlGroup>
          <ControlButton onClick={handleFullscreen} label="Toggle fullscreen">
            <Maximize className="h-4 w-4" />
          </ControlButton>
        </ControlGroup>
      )}
    </div>
  )
}
