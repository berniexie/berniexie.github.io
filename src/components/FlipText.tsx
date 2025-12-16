import { useEffect, useState, useRef } from 'react'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const PUNCTUATION = '.,!?-+()[]{}/ '

// Get the appropriate character set for a given character
function getCharSet(char: string): string {
  if (UPPERCASE.includes(char)) return UPPERCASE
  if (LOWERCASE.includes(char)) return LOWERCASE
  if (NUMBERS.includes(char)) return NUMBERS
  if (PUNCTUATION.includes(char)) return PUNCTUATION
  return char // Single character fallback (will snap immediately)
}

// Get the starting character for a character set
function getStartChar(charSet: string): string {
  return charSet[0] || ' '
}

interface FlipCharProps {
  char: string
  delay: number
  className?: string
}

function FlipChar({ char: target, delay, className = '' }: FlipCharProps) {
  const charSet = getCharSet(target)
  const startChar = getStartChar(charSet)

  const [current, setCurrent] = useState(startChar)
  const [next, setNext] = useState(startChar)
  const [isScrolling, setIsScrolling] = useState(false)

  const currentRef = useRef(startChar)
  const targetRef = useRef(target)
  const charSetRef = useRef(charSet)
  const isAnimatingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Helper to get next char in sequence within the character set
  const getNextChar = (c: string) => {
    const set = charSetRef.current
    const idx = set.indexOf(c)
    if (idx === -1) return set[0]
    return set[(idx + 1) % set.length]
  }

  // Update target ref when prop changes
  useEffect(() => {
    targetRef.current = target
    charSetRef.current = getCharSet(target)

    // If we're not animating, check if we need to start
    if (!isAnimatingRef.current && currentRef.current !== target) {
      // Add initial delay only if we are starting a new sequence from rest
      // (approximated by isAnimatingRef check)
      const startTimeout = setTimeout(() => {
        startLoop()
      }, delay)
      return () => clearTimeout(startTimeout)
    }
  }, [target, delay])

  const startLoop = () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    loop()
  }

  const loop = () => {
    // Safety: if target is not in its character set, snap to it immediately to prevent infinite loop
    if (charSetRef.current.indexOf(targetRef.current) === -1) {
      setCurrent(targetRef.current)
      currentRef.current = targetRef.current
      isAnimatingRef.current = false
      return
    }

    if (currentRef.current === targetRef.current) {
      isAnimatingRef.current = false
      return
    }

    const nextChar = getNextChar(currentRef.current)
    setNext(nextChar)
    setIsScrolling(true)

    // Duration of the slide
    timeoutRef.current = setTimeout(() => {
      // Commit the change
      setCurrent(nextChar)
      currentRef.current = nextChar
      setIsScrolling(false)

      // Schedule next step
      // Using requestAnimationFrame to ensure the 'isScrolling: false'
      // has processed and DOM has reset transform before we start next slide
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          loop()
        })
      })
    }, 25) // 25ms per character step (faster flipping)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className={`relative inline-block overflow-hidden h-[1.2em] w-[0.65em] align-top ${className}`}
      aria-hidden="true"
    >
      <span
        className="flex flex-col w-full transition-transform duration-50 ease-linear will-change-transform"
        style={{
          transform: isScrolling ? 'translateY(-50%)' : 'translateY(0%)',
          // Note: We stack 2 chars. Each is 100% height.
          // So sliding -50% of the 200% container moves to the second char.
        }}
      >
        <span className="h-[1.2em] flex items-center justify-center leading-none">
          {current === ' ' ? '\u00A0' : current}
        </span>
        <span className="h-[1.2em] flex items-center justify-center leading-none">
          {next === ' ' ? '\u00A0' : next}
        </span>
      </span>
    </span>
  )
}

interface FlipTextProps {
  children: string
  className?: string
  delay?: number
}

export function FlipText({ children, className = '', delay = 0 }: FlipTextProps) {
  // Use a fixed array mapping if possible, but splitting children works
  const chars = children.split('')

  // We wrap in a generic span for the semantic text
  return (
    <span className={`inline-flex ${className}`} aria-label={children}>
      {chars.map((char, index) => (
        <FlipChar
          key={index}
          char={char}
          delay={delay} // No stagger, all start at base delay
        />
      ))}
    </span>
  )
}
