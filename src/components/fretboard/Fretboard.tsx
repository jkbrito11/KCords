import { buildFretboard } from '../../domain/fretboard/fretboard'
import { isInChord, isInScale, isManuallySelected } from '../../domain/fretboard/highlight'
import { noteToSemitone } from '../../domain/music/notes'
import type { HighlightLayers } from '../../domain/fretboard/highlight'
import type { NoteName } from '../../domain/music/notes'
import { cn } from '../../lib/utils'

const INTERVAL_LABELS: Record<number, string> = {
  0: '1',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
}

const SINGLE_MARKER_FRETS = new Set([3, 5, 7, 9, 15, 17, 19, 21])
const DOUBLE_MARKER_FRETS = new Set([12, 24])

type FretboardProps = {
  root: string
  viewMode: 'notes' | 'intervals'
  tuning: NoteName[]
  fretCount: number
  layers: HighlightLayers
  voicingPositions?: Array<{ stringIndex: number; fret: number }>
}

function noteLabel(note: string, root: string, viewMode: 'notes' | 'intervals', inScale: boolean) {
  if (viewMode === 'notes' || !inScale) {
    return note
  }

  const distance = (noteToSemitone(note) - noteToSemitone(root) + 12) % 12
  return INTERVAL_LABELS[distance] ?? note
}

export function Fretboard({ root, viewMode, tuning, fretCount, layers, voicingPositions = [] }: FretboardProps) {
  const strings = buildFretboard(tuning, fretCount)
  const voicingSet = new Set(voicingPositions.map((position) => `${position.stringIndex}-${position.fret}`))

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="min-w-full border-collapse bg-zinc-950/80 text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-zinc-950 p-2 text-zinc-400">Corda</th>
            {Array.from({ length: fretCount + 1 }, (_, fret) => (
              <th key={fret} className="border-l border-zinc-800 p-2 text-zinc-400">
                {fret}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...strings].reverse().map((stringData, visualIndex) => (
            <tr key={stringData.stringIndex}>
              <td className="sticky left-0 z-10 border-t border-zinc-800 bg-zinc-950 p-2 text-zinc-300">
                {tuning.length - visualIndex} ({stringData.openNote})
              </td>
              {stringData.positions.map((position) => {
                const inScale = isInScale(position.note, layers)
                const inChord = isInChord(position.note, layers)
                const inSelected = isManuallySelected(position.note, layers)
                const inVoicing = voicingSet.has(`${position.stringIndex}-${position.fret}`)
                const label = noteLabel(position.note, root, viewMode, inScale)

                return (
                  <td key={`${position.stringIndex}-${position.fret}`} className="border-l border-t border-zinc-900 p-1">
                    <span
                      className={cn(
                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors',
                        !inScale && !inChord && !inSelected && 'border-zinc-800 bg-zinc-900 text-zinc-500',
                        inScale && 'border-sky-500/50 bg-sky-500/20 text-sky-100',
                        inSelected && 'border-emerald-500 bg-emerald-500/25 text-emerald-100',
                        inChord && 'border-amber-400 bg-amber-500/25 text-amber-100',
                        inVoicing && 'border-fuchsia-400 bg-fuchsia-500/25 text-fuchsia-100',
                      )}
                    >
                      {label}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="sticky left-0 z-10 border-t border-zinc-800 bg-zinc-950 p-2 text-[10px] text-zinc-500">Marcacoes</td>
            {Array.from({ length: fretCount + 1 }, (_, fret) => {
              const hasSingle = SINGLE_MARKER_FRETS.has(fret)
              const hasDouble = DOUBLE_MARKER_FRETS.has(fret)

              return (
                <td key={`marker-${fret}`} className="border-l border-t border-zinc-900 p-1">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center gap-1">
                    {hasSingle ? <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" aria-hidden="true" /> : null}
                    {hasDouble ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" aria-hidden="true" />
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" aria-hidden="true" />
                      </>
                    ) : null}
                  </div>
                </td>
              )
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
