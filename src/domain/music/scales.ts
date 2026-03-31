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
  { id: 'major', name: 'Major (Ionian)', family: 'diatonic', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'natural_minor', name: 'Natural Minor (Aeolian)', family: 'diatonic', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'dorian', name: 'Dorian', family: 'mode', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'phrygian', name: 'Phrygian', family: 'mode', intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: 'lydian', name: 'Lydian', family: 'mode', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: 'mixolydian', name: 'Mixolydian', family: 'mode', intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: 'locrian', name: 'Locrian', family: 'mode', intervals: [0, 1, 3, 5, 6, 8, 10] },
  { id: 'major_pentatonic', name: 'Major Pentatonic', family: 'pentatonic', intervals: [0, 2, 4, 7, 9] },
  { id: 'minor_pentatonic', name: 'Minor Pentatonic', family: 'pentatonic', intervals: [0, 3, 5, 7, 10] },
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
