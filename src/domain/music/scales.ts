import { shouldPreferSharps, transposeNote } from './notes'
import type { NoteName } from './notes'

export type ScaleFamily = 'diatonic' | 'mode' | 'pentatonic'

export type ScaleFormula = {
  id: string
  name: string
  family: ScaleFamily
  intervals: number[]
}

export const SCALE_LIBRARY: ScaleFormula[] = [
  { id: 'major', name: 'Maior (Jonio)', family: 'diatonic', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'natural_minor', name: 'Menor Natural (Aeolio)', family: 'diatonic', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'harmonic_minor', name: 'Menor Harmonica', family: 'diatonic', intervals: [0, 2, 3, 5, 7, 8, 11] },
  { id: 'melodic_minor', name: 'Menor Melodica', family: 'diatonic', intervals: [0, 2, 3, 5, 7, 9, 11] },
  { id: 'dorian', name: 'Dorico', family: 'mode', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'phrygian', name: 'Frigio', family: 'mode', intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: 'lydian', name: 'Lidio', family: 'mode', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: 'mixolydian', name: 'Mixolidio', family: 'mode', intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: 'locrian', name: 'Locrio', family: 'mode', intervals: [0, 1, 3, 5, 6, 8, 10] },
  { id: 'major_pentatonic', name: 'Pentatonica Maior', family: 'pentatonic', intervals: [0, 2, 4, 7, 9] },
  { id: 'minor_pentatonic', name: 'Pentatonica Menor', family: 'pentatonic', intervals: [0, 3, 5, 7, 10] },
]

export function getScaleFormula(scaleId: string): ScaleFormula {
  const formula = SCALE_LIBRARY.find((scale) => scale.id === scaleId)
  if (!formula) {
    throw new Error(`Unknown scale: ${scaleId}`)
  }
  return formula
}

export function scaleNotes(root: string, scaleId: string): NoteName[] {
  const formula = getScaleFormula(scaleId)
  const preferSharps = shouldPreferSharps(root)
  return formula.intervals.map((interval) => transposeNote(root, interval, preferSharps))
}
