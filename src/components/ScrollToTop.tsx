import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const targetId = hash ? decodeURIComponent(hash.slice(1)) : ''
      const target = targetId ? document.getElementById(targetId) : null

      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'auto' })
        return
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export default ScrollToTop
