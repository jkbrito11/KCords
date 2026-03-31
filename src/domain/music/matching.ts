import { normalizeNote } from './notes'
import { SCALE_LIBRARY, scaleNotes } from './scales'

export type ScaleMatch = {
  root: string
  scaleId: string
  scaleName: string
  score: number
  matched: string[]
  missing: string[]
}

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function matchScalesByPitchSet(selectedNotes: string[], threshold = 0.5): ScaleMatch[] {
  const normalizedSelection = [...new Set(selectedNotes.map((note) => normalizeNote(note)))]
  if (normalizedSelection.length < 2) {
    return []
  }

  const matches: ScaleMatch[] = []

  for (const root of ROOTS) {
    for (const scale of SCALE_LIBRARY) {
      const notes = scaleNotes(root, scale.id).map((note) => normalizeNote(note))
      const matched = normalizedSelection.filter((note) => notes.includes(note))
      const missing = normalizedSelection.filter((note) => !notes.includes(note))
      const score = matched.length / normalizedSelection.length

      if (score >= threshold) {
        matches.push({
          root,
          scaleId: scale.id,
          scaleName: scale.name,
          score,
          matched,
          missing,
        })
      }
    }
  }

  return matches.sort((a, b) => b.score - a.score || a.scaleName.localeCompare(b.scaleName)).slice(0, 20)
}
