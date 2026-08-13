import type { CSSProperties } from 'react'

const FLAP_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,·-/'
const TOP_FLIP_DURATION = 95
const BOTTOM_FLIP_DURATION = 115
const FLIP_STEP_DURATION = TOP_FLIP_DURATION + BOTTOM_FLIP_DURATION
const SLOT_COUNTS = {
  primary: 26,
  detail: 16,
} as const

type SplitFlapVariant = 'primary' | 'detail'

interface SplitFlapTextProps {
  text: string
  variant?: SplitFlapVariant
  rowIndex: number
  cycle: number
  play: boolean
}

const graphemeSegmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('en', { granularity: 'grapheme' })
    : null

function splitGraphemes(value: string) {
  if (!graphemeSegmenter) return Array.from(value)
  return Array.from(graphemeSegmenter.segment(value), ({ segment }) => segment)
}

function getIntermediateGlyphs(target: string) {
  const targetIndex = FLAP_GLYPHS.indexOf(target)
  if (targetIndex <= 0) return []

  const hopCount = Math.min(3, Math.max(1, Math.ceil(targetIndex / 6)))

  return Array.from({ length: hopCount - 1 }, (_, index) => {
    const glyphIndex = Math.round((targetIndex * (index + 1)) / hopCount)
    return FLAP_GLYPHS[glyphIndex]
  })
}

interface SplitFlapCharacterProps {
  target: string
  rowIndex: number
  characterIndex: number
}

function SplitFlapCharacter({ target, rowIndex, characterIndex }: SplitFlapCharacterProps) {
  const isBlank = target === '' || target === ' '
  const sequence = isBlank
    ? []
    : ['A', ...getIntermediateGlyphs(target), ...(target === 'A' ? [] : [target])]
  const startDelay = rowIndex * 55 + characterIndex * 10
  const characterStyle = {
    '--split-flap-start-delay': `${startDelay}ms`,
  } as CSSProperties
  const targetGlyph = isBlank ? '\u00a0' : target
  let previousGlyph = ' '

  return (
    <span
      className={`split-flap-character${isBlank ? ' split-flap-character--blank' : ''}`}
      style={characterStyle}
    >
      <span className="split-flap-character__base">&nbsp;</span>
      <span className="split-flap-character__final">{targetGlyph}</span>

      {sequence.map((nextGlyph, stepIndex) => {
        const outgoingGlyph = previousGlyph
        previousGlyph = nextGlyph
        const delay = startDelay + stepIndex * FLIP_STEP_DURATION
        const style = { '--split-flap-delay': `${delay}ms` } as CSSProperties

        return (
          <span className="split-flap-step" key={`${stepIndex}-${nextGlyph}`} style={style}>
            <span className="split-flap-step__target">{nextGlyph}</span>
            <span className="split-flap-half split-flap-half--old-bottom">
              <span>{outgoingGlyph === ' ' ? '\u00a0' : outgoingGlyph}</span>
            </span>
            <span className="split-flap-half split-flap-half--outgoing">
              <span>{outgoingGlyph === ' ' ? '\u00a0' : outgoingGlyph}</span>
            </span>
            <span className="split-flap-half split-flap-half--incoming">
              <span>{nextGlyph}</span>
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function SplitFlapText({
  text,
  variant = 'primary',
  rowIndex,
  cycle,
  play,
}: SplitFlapTextProps) {
  const displayText = text.toLocaleUpperCase('en-US')
  const characters = splitGraphemes(displayText)
  const slotCount = Math.max(SLOT_COUNTS[variant], characters.length)
  const slots = Array.from({ length: slotCount }, (_, index) => characters[index] ?? '')
  const style = { '--split-flap-slots': slotCount } as CSSProperties

  return (
    <span
      aria-hidden="true"
      className={`split-flap-text split-flap-text--${variant}`}
      data-playing={play ? 'true' : 'false'}
      key={cycle}
      style={style}
    >
      {slots.map((character, index) => (
        <SplitFlapCharacter
          characterIndex={index}
          key={`${index}-${character || 'empty'}`}
          rowIndex={rowIndex}
          target={character}
        />
      ))}
    </span>
  )
}
