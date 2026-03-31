import { shouldPreferSharps, transposeNote } from '../music/notes'
import type { NoteName } from '../music/notes'

export type FretPosition = {
  stringIndex: number
  fret: number
  note: NoteName
}

export type FretboardString = {
  stringIndex: number
  openNote: NoteName
  positions: FretPosition[]
}

export const STANDARD_TUNING_6: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E']
export const STANDARD_TUNING_7: NoteName[] = ['B', 'E', 'A', 'D', 'G', 'B', 'E']

export function buildFretboard(tuning: NoteName[], fretCount = 15): FretboardString[] {
  return tuning.map((openNote, stringIndex) => {
    const preferSharps = shouldPreferSharps(openNote)
    const positions = Array.from({ length: fretCount + 1 }, (_, fret) => ({
      stringIndex,
      fret,
      note: transposeNote(openNote, fret, preferSharps),
    }))

    return {
      stringIndex,
      openNote,
      positions,
    }
  })
}
