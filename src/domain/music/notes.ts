export const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const

export type SharpNote = (typeof CHROMATIC_SHARPS)[number]
export type FlatNote = (typeof CHROMATIC_FLATS)[number]
export type NoteName = SharpNote | FlatNote

const ENHARMONIC_TO_SHARP: Record<string, SharpNote> = {
  C: 'C',
  'B#': 'C',
  'C#': 'C#',
  DB: 'C#',
  D: 'D',
  'D#': 'D#',
  EB: 'D#',
  E: 'E',
  FB: 'E',
  'E#': 'F',
  F: 'F',
  'F#': 'F#',
  GB: 'F#',
  G: 'G',
  'G#': 'G#',
  AB: 'G#',
  A: 'A',
  'A#': 'A#',
  BB: 'A#',
  B: 'B',
  CB: 'B',
}

const SHARP_KEYS = new Set(CHROMATIC_SHARPS)

export function normalizeNote(note: string): SharpNote {
  const normalized = note.trim().toUpperCase().replace('♯', '#').replace('♭', 'B')
  const mapped = ENHARMONIC_TO_SHARP[normalized]
  if (!mapped) {
    throw new Error(`Invalid note: ${note}`)
  }
  return mapped
}

export function noteToSemitone(note: string): number {
  return CHROMATIC_SHARPS.indexOf(normalizeNote(note))
}

export function semitoneToNote(semitone: number, preferSharps = true): NoteName {
  const wrapped = ((semitone % 12) + 12) % 12
  return preferSharps ? CHROMATIC_SHARPS[wrapped] : CHROMATIC_FLATS[wrapped]
}

export function shouldPreferSharps(root: string): boolean {
  return SHARP_KEYS.has(normalizeNote(root))
}

export function transposeNote(note: string, semitones: number, preferSharps?: boolean): NoteName {
  const root = noteToSemitone(note)
  const target = root + semitones
  const useSharps = preferSharps ?? shouldPreferSharps(note)
  return semitoneToNote(target, useSharps)
}

export function uniquePitchClasses(notes: string[]): SharpNote[] {
  const unique = new Set(notes.map((n) => normalizeNote(n)))
  return [...unique]
}
