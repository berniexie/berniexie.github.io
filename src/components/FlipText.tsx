import { useEffect, useState, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function scramble(text: string): string {
  return text
    .split('')
    .map((char) => (char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
    .join('')
}

interface FlipTextProps {
  children: string
  className?: string
  delay?: number
}

export function FlipText({ children, className = '', delay = 0 }: FlipTextProps) {
  const [output, setOutput] = useState(() => scramble(children))
  const prevChildren = useRef(children)

  useEffect(() => {
    // Only re-scramble if children actually changed (not on initial mount)
    if (prevChildren.current !== children) {
      setOutput(scramble(children))
      prevChildren.current = children
    }

    let animationFrameId: number
    let iteration = 0
    let lastTime = 0
    const frameInterval = 30 // Target ~33fps (30ms between frames)

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime

      const elapsed = currentTime - lastTime

      if (elapsed >= frameInterval) {
        lastTime = currentTime

        setOutput(
          children
            .split('')
            .map((letter, index) => {
              if (index < iteration) return children[index]
              if (letter === ' ') return ' '
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )

        if (iteration >= children.length) {
          return // Stop animation
        }

        iteration += 1 / 3
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const startTimeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      cancelAnimationFrame(animationFrameId)
    }
  }, [children, delay])

  return (
    <span className={`${className} inline-block`} aria-label={children}>
      {output}
    </span>
  )
}
