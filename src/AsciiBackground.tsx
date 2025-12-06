import { useEffect, useRef } from 'react'

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
    let time = 0

    // Mouse state
    const mouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Configuration
    const fontSize = 12
    const font = `bold ${fontSize}px "Space Mono", monospace`
    // Using a geometric character set for a "tech/blueprint" feel
    const chars = ' ·+x*#'

    const draw = () => {
      // Clear with fade effect for "motion blur" if desired,
      // but for crisp ASCII, full clear is often better.
      // Let's go with a solid clear to avoid muddying the text.
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)

      ctx.font = font

      const rows = Math.ceil(height / fontSize)
      const cols = Math.ceil(width / (fontSize * 0.6)) // 0.6 aspect ratio approx

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Screen coordinates
          const px = x * fontSize * 0.6
          const py = y * fontSize

          // Calculate distance from mouse for interaction
          const dx = px - mouse.x
          const dy = py - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Interactive "Flashlight" / Distortion effect
          // The closer the mouse, the faster/more turbulent the wave
          const interaction = Math.max(0, 1 - dist / 400) // 400px radius

          // Wave math: layers of Sine waves
          // We mix coordinate-based offset with time
          const scale = 0.05
          const v1 = Math.sin(x * scale + time * 0.5)
          const v2 = Math.cos(y * scale + time * 0.3)
          const v3 = Math.sin((x + y) * 0.02 + time * 1.2) // Fast ripples

          // Combine waves
          const value = v1 + v2 + v3 * interaction * 2

          // Normalize roughly to 0-1 range for char mapping
          // value range is approx -2 to 2 normally, extended by interaction
          const mapIndex = Math.floor(((value + 2 + interaction) / 5) * chars.length)
          const charIndex = Math.max(0, Math.min(chars.length - 1, mapIndex))

          const char = chars[charIndex]

          // Skip empty space for cleaner look
          if (char === ' ') continue

          // Dynamic Coloring
          // Dark grey base, getting brighter/more colored with "height" or interaction
          // Subtle background breathing
          const brightness = 0.04 + (charIndex / chars.length) * 0.10
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`

          ctx.fillText(char, px, py)
        }
      }

      time += 0.02
    }

    const render = () => {
      draw()
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

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
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
