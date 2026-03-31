import { noteToSemitone, semitoneToNote, shouldPreferSharps } from './notes'
import { getScaleFormula, scaleNotes } from './scales'

export type HarmonicChord = {
  degree: number
  roman: string
  name: string
  notes: string[]
  quality: string
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length
}

function intervalsFromRoot(notes: string[]): number[] {
  const root = noteToSemitone(notes[0])
  return notes.map((note) => (noteToSemitone(note) - root + 12) % 12)
}

function triadQuality(intervals: number[]): string {
  const triad = intervals.slice(0, 3).join('-')
  if (triad === '0-4-7') return ''
  if (triad === '0-3-7') return 'm'
  if (triad === '0-3-6') return 'dim'
  if (triad === '0-4-8') return 'aug'
  if (triad === '0-2-7') return 'sus2'
  if (triad === '0-5-7') return 'sus4'
  return 'add'
}

function tetradSuffix(intervals: number[]): string {
  const tetrad = intervals.join('-')
  if (tetrad === '0-4-7-11') return 'maj7'
  if (tetrad === '0-4-7-10') return '7'
  if (tetrad === '0-3-7-10') return 'm7'
  if (tetrad === '0-3-7-11') return 'mMaj7'
  if (tetrad === '0-3-6-10') return 'm7b5'
  if (tetrad === '0-3-6-9') return 'dim7'
  return 'add7'
}

function degreeToRoman(degree: number, quality: string): string {
  const base = ROMAN_NUMERALS[degree - 1] ?? '?'
  if (quality.startsWith('m') || quality === 'dim') {
    return base.toLowerCase()
  }
  return base
}

function buildStackedChord(scale: string[], degree: number, depth: 3 | 4): string[] {
  const rootIndex = degree - 1
  const notes: string[] = []
  for (let i = 0; i < depth; i += 1) {
    notes.push(scale[wrapIndex(rootIndex + i * 2, scale.length)])
  }
  return notes
}

export function harmonicField(root: string, scaleId: string, depth: 3 | 4 = 3): HarmonicChord[] {
  const notes = scaleNotes(root, scaleId)
  return notes.map((_, idx) => {
    const degree = idx + 1
    const stacked = buildStackedChord(notes, degree, depth)
    const intervals = intervalsFromRoot(stacked)
    const triad = triadQuality(intervals)
    const suffix = depth === 4 ? tetradSuffix(intervals) : triad
    const symbol = `${stacked[0]}${suffix}`

    return {
      degree,
      roman: degreeToRoman(degree, triad),
      name: symbol,
      notes: stacked,
      quality: suffix,
    }
  })
}

export type RelativeOption = {
  label: string
  root: string
  scaleId: string
}

export function relativeOptions(root: string, scaleId: string): RelativeOption[] {
  const preferSharps = shouldPreferSharps(root)
  const semitone = noteToSemitone(root)

  if (scaleId === 'major') {
    return [
      { label: 'Relativa Menor (vi)', root: semitoneToNote(semitone + 9, preferSharps), scaleId: 'natural_minor' },
      { label: 'Menor Paralela', root: semitoneToNote(semitone, preferSharps), scaleId: 'natural_minor' },
    ]
  }

  if (scaleId === 'natural_minor') {
    return [
      { label: 'Relativa Maior (III)', root: semitoneToNote(semitone + 3, preferSharps), scaleId: 'major' },
      { label: 'Maior Paralela', root: semitoneToNote(semitone, preferSharps), scaleId: 'major' },
    ]
  }

  const parentMajorRoot = semitoneToNote(semitone + 7, preferSharps)
  return [
    { label: 'Contexto Maior Mais Proximo', root: parentMajorRoot, scaleId: 'major' },
    { label: 'Contexto Menor Paralelo', root: semitoneToNote(semitone, preferSharps), scaleId: 'natural_minor' },
  ]
}

export function scaleLabel(scaleId: string): string {
  return getScaleFormula(scaleId).name
}
