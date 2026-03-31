import { buildFretboard } from './fretboard'
import { normalizeNote, noteToSemitone } from '../music/notes'
import type { FretPosition } from './fretboard'
import type { NoteName } from '../music/notes'

export type ChordVoicing = {
  id: string
  label: string
  positions: FretPosition[]
}

type Candidate = {
  position: FretPosition
  normalizedNote: string
}

function signatureFromPositions(positions: FretPosition[]): string {
  return positions
    .slice()
    .sort((a, b) => a.stringIndex - b.stringIndex)
    .map((p) => `${p.stringIndex}:${p.fret}`)
    .join('|')
}

function voicingScore(positions: FretPosition[], uniqueNotesCount: number): number {
  const frets = positions.map((position) => position.fret)
  const maxFret = Math.max(...frets)
  const minFret = Math.min(...frets)
  const span = maxFret - minFret
  const avgFret = frets.reduce((sum, fret) => sum + fret, 0) / frets.length
  const openStrings = frets.filter((fret) => fret === 0).length

  return span * 8 + avgFret + openStrings * 0.5 + (4 - uniqueNotesCount) * 2
}

function buildOpenStringPitches(tuning: NoteName[]): number[] {
  const openPitches: number[] = []

  tuning.forEach((note, index) => {
    const semitone = noteToSemitone(note)
    if (index === 0) {
      openPitches.push(semitone)
      return
    }

    const previous = openPitches[index - 1]
    let pitch = semitone
    while (pitch <= previous) {
      pitch += 12
    }
    openPitches.push(pitch)
  })

  return openPitches
}

function lowestRootPitch(
  positions: FretPosition[],
  rootNote: string,
  openStringPitches: number[],
): number {
  const rootPositions = positions.filter((position) => normalizeNote(position.note) === rootNote)
  if (rootPositions.length === 0) {
    return Number.POSITIVE_INFINITY
  }

  return Math.min(...rootPositions.map((position) => openStringPitches[position.stringIndex] + position.fret))
}

function bassNote(positions: FretPosition[], openStringPitches: number[]): string {
  const ordered = positions
    .slice()
    .sort(
      (a, b) =>
        openStringPitches[a.stringIndex] + a.fret - (openStringPitches[b.stringIndex] + b.fret),
    )

  return normalizeNote(ordered[0]?.note ?? '')
}

function inversionLabel(chordNotes: string[], bassNormalizedNote: string): string | null {
  const orderedChordTones = [...new Set(chordNotes.map((note) => normalizeNote(note)))]
  const inversionIndex = orderedChordTones.findIndex((note) => note === bassNormalizedNote)

  if (inversionIndex <= 0) {
    return null
  }

  const labels = ['1a inversao', '2a inversao', '3a inversao']
  return labels[inversionIndex - 1] ?? `${inversionIndex}a inversao`
}

export function generateChordVoicings(
  tuning: NoteName[],
  fretCount: number,
  chordNotes: string[],
  maxResults = 8,
): ChordVoicing[] {
  const chordSet = new Set(chordNotes.map((note) => normalizeNote(note)))
  const rootNote = normalizeNote(chordNotes[0] ?? '')
  if (chordSet.size < 3) {
    return []
  }

  const fretboard = buildFretboard(tuning, fretCount)
  const openStringPitches = buildOpenStringPitches(tuning)
  const stringCount = tuning.length
  const maxFretToSearch = Math.min(fretCount, 12)
  const bestBySignature = new Map<string, { positions: FretPosition[]; score: number }>()

  const groupSizes = [3, 4]

  for (const groupSize of groupSizes) {
    for (let start = 0; start <= stringCount - groupSize; start += 1) {
      const groupStrings = fretboard.slice(start, start + groupSize)
      const candidatesByString: Candidate[][] = groupStrings.map((stringData) =>
        stringData.positions
          .filter((position) => position.fret <= maxFretToSearch && chordSet.has(normalizeNote(position.note)))
          .map((position) => ({ position, normalizedNote: normalizeNote(position.note) }))
          .slice(0, 10),
      )

      if (candidatesByString.some((candidates) => candidates.length === 0)) {
        continue
      }

      const current: Candidate[] = []

      const search = (depth: number) => {
        if (depth === candidatesByString.length) {
          const positions = current.map((candidate) => candidate.position)
          const notesUsed = new Set(current.map((candidate) => candidate.normalizedNote))
          const frets = positions.map((position) => position.fret)
          const maxFret = Math.max(...frets)
          const minFret = Math.min(...frets)
          const span = maxFret - minFret

          if (span > 4) {
            return
          }

          if (notesUsed.size < 3) {
            return
          }

          const signature = signatureFromPositions(positions)
          const score = voicingScore(positions, notesUsed.size)
          const previous = bestBySignature.get(signature)

          if (!previous || score < previous.score) {
            bestBySignature.set(signature, { positions, score })
          }

          return
        }

        for (const candidate of candidatesByString[depth]) {
          current.push(candidate)
          search(depth + 1)
          current.pop()
        }
      }

      search(0)
    }
  }

  return [...bestBySignature.values()]
    .sort((a, b) => {
      const aRoot = lowestRootPitch(a.positions, rootNote, openStringPitches)
      const bRoot = lowestRootPitch(b.positions, rootNote, openStringPitches)
      return aRoot - bRoot || a.score - b.score
    })
    .slice(0, maxResults)
    .map((entry, index) => {
      const frets = entry.positions.map((position) => position.fret)
      const minFret = Math.min(...frets)
      const maxFret = Math.max(...frets)
      const bass = bassNote(entry.positions, openStringPitches)
      const inversion = inversionLabel(chordNotes, bass)

      return {
        id: `voicing-${index + 1}`,
        label: inversion
          ? `Forma ${index + 1} (${minFret}-${maxFret}) • ${inversion}`
          : `Forma ${index + 1} (${minFret}-${maxFret})`,
        positions: entry.positions,
      }
    })
}
