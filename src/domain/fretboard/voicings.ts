import { buildFretboard } from './fretboard'
import { normalizeNote } from '../music/notes'
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

export function generateChordVoicings(
  tuning: NoteName[],
  fretCount: number,
  chordNotes: string[],
  maxResults = 8,
): ChordVoicing[] {
  const chordSet = new Set(chordNotes.map((note) => normalizeNote(note)))
  if (chordSet.size < 3) {
    return []
  }

  const fretboard = buildFretboard(tuning, fretCount)
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
    .sort((a, b) => a.score - b.score)
    .slice(0, maxResults)
    .map((entry, index) => {
      const frets = entry.positions.map((position) => position.fret)
      const minFret = Math.min(...frets)
      const maxFret = Math.max(...frets)
      return {
        id: `voicing-${index + 1}`,
        label: `Forma ${index + 1} (${minFret}-${maxFret})`,
        positions: entry.positions,
      }
    })
}
