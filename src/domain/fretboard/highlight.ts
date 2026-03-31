import { normalizeNote } from '../music/notes'

export type HighlightLayers = {
  scaleNotes: string[]
  chordNotes: string[]
  selectedNotes: string[]
}

export function isInScale(note: string, layers: HighlightLayers): boolean {
  return layers.scaleNotes.map(normalizeNote).includes(normalizeNote(note))
}

export function isInChord(note: string, layers: HighlightLayers): boolean {
  return layers.chordNotes.map(normalizeNote).includes(normalizeNote(note))
}

export function isManuallySelected(note: string, layers: HighlightLayers): boolean {
  return layers.selectedNotes.map(normalizeNote).includes(normalizeNote(note))
}
