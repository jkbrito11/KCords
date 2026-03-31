import { shouldPreferSharps, transposeNote } from './notes'
import type { NoteName } from './notes'

export type ChordFamily = 'triad' | 'tetrad'

export type ChordFormula = {
  id: string
  name: string
  symbol: string
  family: ChordFamily
  intervals: number[]
}

export const CHORD_LIBRARY: ChordFormula[] = [
  { id: 'maj', name: 'Major Triad', symbol: '', family: 'triad', intervals: [0, 4, 7] },
  { id: 'min', name: 'Minor Triad', symbol: 'm', family: 'triad', intervals: [0, 3, 7] },
  { id: 'dim', name: 'Diminished Triad', symbol: 'dim', family: 'triad', intervals: [0, 3, 6] },
  { id: 'aug', name: 'Augmented Triad', symbol: 'aug', family: 'triad', intervals: [0, 4, 8] },
  { id: 'sus2', name: 'Suspended 2', symbol: 'sus2', family: 'triad', intervals: [0, 2, 7] },
  { id: 'sus4', name: 'Suspended 4', symbol: 'sus4', family: 'triad', intervals: [0, 5, 7] },
  { id: 'maj7', name: 'Major Seventh', symbol: 'maj7', family: 'tetrad', intervals: [0, 4, 7, 11] },
  { id: '7', name: 'Dominant Seventh', symbol: '7', family: 'tetrad', intervals: [0, 4, 7, 10] },
  { id: 'm7', name: 'Minor Seventh', symbol: 'm7', family: 'tetrad', intervals: [0, 3, 7, 10] },
  { id: 'mMaj7', name: 'Minor Major Seventh', symbol: 'mMaj7', family: 'tetrad', intervals: [0, 3, 7, 11] },
  { id: 'm7b5', name: 'Half Diminished', symbol: 'm7b5', family: 'tetrad', intervals: [0, 3, 6, 10] },
  { id: 'dim7', name: 'Diminished Seventh', symbol: 'dim7', family: 'tetrad', intervals: [0, 3, 6, 9] },
]

export function getChordFormula(chordId: string): ChordFormula {
  const formula = CHORD_LIBRARY.find((chord) => chord.id === chordId)
  if (!formula) {
    throw new Error(`Unknown chord: ${chordId}`)
  }
  return formula
}

export function chordNotes(root: string, chordId: string): NoteName[] {
  const formula = getChordFormula(chordId)
  const preferSharps = shouldPreferSharps(root)
  return formula.intervals.map((interval) => transposeNote(root, interval, preferSharps))
}
