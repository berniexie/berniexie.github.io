import { useEffect, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// Generate a scrambled version of text (preserving spaces)
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
  // Start with scrambled text so there's no flash of correct content
  // Start with scrambled text so there's no flash of correct content
  const [output, setOutput] = useState(() => scramble(children))

  useEffect(() => {
    // Reset to scrambled state when children changes
    setOutput(scramble(children))
    
    let timer: ReturnType<typeof setInterval>
    let iteration = 0
    
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        setOutput(
          children
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return children[index]
              }
              if (letter === ' ') return ' '
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )

        if (iteration >= children.length) {
          clearInterval(timer)
        }

        iteration += 1 / 3
      }, 30)
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      clearInterval(timer)
    }
  }, [children, delay])

  return (
    <span 
      className={`${className} inline-block`}
      aria-label={children}
    >
      {output}
    </span>
  )
}

