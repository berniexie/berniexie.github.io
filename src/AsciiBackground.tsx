import { useEffect, useRef } from 'react'

// Polyfill for requestIdleCallback (not supported in Safari/iOS)
const requestIdleCallback =
  window.requestIdleCallback ||
  ((cb: IdleRequestCallback) => {
    const start = Date.now()
    return window.setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      })
    }, 1)
  })

const cancelIdleCallback =
  window.cancelIdleCallback || ((id: number) => clearTimeout(id))

// Pre-compute sin/cos lookup tables for performance
const SIN_TABLE_SIZE = 1000
const sinTable: number[] = new Array(SIN_TABLE_SIZE)
const cosTable: number[] = new Array(SIN_TABLE_SIZE)
for (let i = 0; i < SIN_TABLE_SIZE; i++) {
  const angle = (i / SIN_TABLE_SIZE) * Math.PI * 20 // Cover a wide range
  sinTable[i] = Math.sin(angle)
  cosTable[i] = Math.cos(angle)
}

// Fast lookup for sin/cos with table interpolation
function fastSin(x: number): number {
  const normalized = ((x % (Math.PI * 20)) + Math.PI * 20) % (Math.PI * 20)
  const index = Math.floor((normalized / (Math.PI * 20)) * SIN_TABLE_SIZE)
  return sinTable[index % SIN_TABLE_SIZE]
}

function fastCos(x: number): number {
  const normalized = ((x % (Math.PI * 20)) + Math.PI * 20) % (Math.PI * 20)
  const index = Math.floor((normalized / (Math.PI * 20)) * SIN_TABLE_SIZE)
  return cosTable[index % SIN_TABLE_SIZE]
}

const AsciiBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let animationFrameId: number
    let idleCallbackId: number
    let time = 0
    let isRunning = true
    let lastFrameTime = 0
    let lastMouseMoveTime = 0
    const targetFPS = 30 // Throttle to 30fps for better performance
    const frameInterval = 1000 / targetFPS
    const idleThreshold = 2000 // Switch to idle callback after 2s of no mouse movement

    // Mouse state
    const mouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      lastMouseMoveTime = performance.now()
    }

    // Pause animation when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false
        cancelAnimationFrame(animationFrameId)
        cancelIdleCallback(idleCallbackId)
      } else {
        isRunning = true
        lastFrameTime = 0
        lastMouseMoveTime = performance.now() // Reset to use rAF initially
        render(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Configuration - increased cell size for fewer calculations
    const fontSize = 14 // Slightly larger for fewer cells
    const cellWidth = fontSize * 0.6
    const font = `bold ${fontSize}px "Space Mono", monospace`
    const chars = ' ·+x*#'
    const interactionRadiusSq = 400 * 400 // Pre-compute squared radius to avoid sqrt

    // Get theme colors from CSS variables
    const computedStyle = getComputedStyle(document.documentElement)
    const bgColor = computedStyle.getPropertyValue('--color-bg').trim() || '#f8f7f4'
    const textColor = computedStyle.getPropertyValue('--color-text').trim() || '#1a1a1a'

    // Parse text color to RGB for transparency support
    const parseColor = (color: string): [number, number, number] => {
      if (color.startsWith('#')) {
        const hex = color.slice(1)
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return [r, g, b]
      }
      return [26, 26, 26] // fallback dark color
    }
    const [r, g, b] = parseColor(textColor)

    const draw = () => {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      ctx.font = font

      const rows = Math.ceil(height / fontSize)
      const cols = Math.ceil(width / cellWidth)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Screen coordinates
          const px = x * cellWidth
          const py = y * fontSize

          // Use squared distance to avoid expensive sqrt
          const dx = px - mouse.x
          const dy = py - mouse.y
          const distSq = dx * dx + dy * dy

          // Skip expensive calculations for cells far from mouse
          const interaction =
            distSq < interactionRadiusSq ? Math.max(0, 1 - Math.sqrt(distSq) / 400) : 0

          // Use lookup tables for trig functions
          const scale = 0.05
          const v1 = fastSin(x * scale + time * 0.5)
          const v2 = fastCos(y * scale + time * 0.3)
          const v3 = fastSin((x + y) * 0.02 + time * 1.2)

          // Combine waves
          const value = v1 + v2 + v3 * interaction * 2

          // Normalize roughly to 0-1 range for char mapping
          const mapIndex = Math.floor(((value + 2 + interaction) / 5) * chars.length)
          const charIndex = Math.max(0, Math.min(chars.length - 1, mapIndex))

          const char = chars[charIndex]

          // Skip empty space for cleaner look
          if (char === ' ') continue

          // Dynamic Coloring - use theme text color with very subtle transparency
          const brightness = 0.02 + (charIndex / chars.length) * 0.04
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`

          ctx.fillText(char, px, py)
        }
      }

      time += 0.02
    }

    // Idle callback for low-priority rendering when user isn't interacting
    const renderIdle = (deadline: IdleDeadline) => {
      if (!isRunning) return

      // Only draw if we have time remaining
      if (deadline.timeRemaining() > 5) {
        draw()
      }

      // Check if user has started interacting again
      const timeSinceMouseMove = performance.now() - lastMouseMoveTime
      if (timeSinceMouseMove < idleThreshold) {
        // Switch back to requestAnimationFrame for responsive rendering
        lastFrameTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      } else {
        // Continue with idle callbacks
        idleCallbackId = requestIdleCallback(renderIdle, { timeout: 100 })
      }
    }

    const render = (currentTime: number) => {
      if (!isRunning) return

      // Check if we should switch to idle callback (no mouse activity)
      const timeSinceMouseMove = currentTime - lastMouseMoveTime
      if (lastMouseMoveTime > 0 && timeSinceMouseMove > idleThreshold) {
        // Switch to requestIdleCallback for lower priority rendering
        idleCallbackId = requestIdleCallback(renderIdle, { timeout: 100 })
        return
      }

      // Throttle to target FPS
      if (currentTime - lastFrameTime >= frameInterval) {
        lastFrameTime = currentTime
        draw()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    handleResize() // Initial size
    window.addEventListener('resize', handleResize)

    render(0)

    return () => {
      isRunning = false
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
      cancelIdleCallback(idleCallbackId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  )
}

export default AsciiBackground
