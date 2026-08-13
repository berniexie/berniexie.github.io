import { useEffect, useRef, useState } from 'react'

interface UseNearViewportOptions {
  rootMargin?: string
}

export function useNearViewport({ rootMargin = '600px 0px' }: UseNearViewportOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element || isNearViewport) return

    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsNearViewport(true)
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [isNearViewport, rootMargin])

  return { elementRef, isNearViewport }
}
