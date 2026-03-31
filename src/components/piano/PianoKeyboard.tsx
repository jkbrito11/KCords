import { CHROMATIC_SHARPS, normalizeNote, noteToSemitone } from '../../domain/music/notes'
import type { HighlightLayers } from '../../domain/fretboard/highlight'
import { cn } from '../../lib/utils'

type PianoKeyboardProps = {
  root: string
  viewMode: 'notes' | 'intervals'
  layers: HighlightLayers
  voicingNotes?: string[]
  octaveStart?: number
  octaveEnd?: number
}

type PianoKey = {
  id: string
  note: string
  octave: number
  isBlack: boolean
  whiteIndex: number
}

const BLACK_INDEXES = new Set([1, 3, 6, 8, 10])
const WHITE_KEY_WIDTH = 40
const BLACK_KEY_WIDTH = 24

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

const INTERVAL_NAMES_PT_BR: Record<number, string> = {
  0: 'Unissono (Tonica)',
  1: 'Segunda menor',
  2: 'Segunda maior',
  3: 'Terca menor',
  4: 'Terca maior',
  5: 'Quarta justa',
  6: 'Tritono',
  7: 'Quinta justa',
  8: 'Sexta menor',
  9: 'Sexta maior',
  10: 'Setima menor',
  11: 'Setima maior',
}

function buildKeys(octaveStart: number, octaveEnd: number): PianoKey[] {
  const keys: PianoKey[] = []
  let whiteCount = 0

  for (let octave = octaveStart; octave <= octaveEnd; octave += 1) {
    for (let semitone = 0; semitone < 12; semitone += 1) {
      const note = CHROMATIC_SHARPS[semitone]
      const isBlack = BLACK_INDEXES.has(semitone)
      keys.push({
        id: `${note}${octave}`,
        note,
        octave,
        isBlack,
        whiteIndex: whiteCount,
      })
      if (!isBlack) {
        whiteCount += 1
      }
    }
  }

  return keys
}

function containsNote(collection: string[], note: string): boolean {
  const normalized = normalizeNote(note)
  return collection.map((item) => normalizeNote(item)).includes(normalized)
}

function intervalInfo(note: string, root: string) {
  const distance = (noteToSemitone(note) - noteToSemitone(root) + 12) % 12
  return {
    label: INTERVAL_LABELS[distance] ?? '?',
    name: INTERVAL_NAMES_PT_BR[distance] ?? 'Intervalo',
  }
}

function keyLabel(note: string, root: string, viewMode: 'notes' | 'intervals', inScale: boolean) {
  if (viewMode === 'notes' || !inScale) {
    return note
  }
  return intervalInfo(note, root).label
}

type HighlightKind = 'none' | 'scale' | 'selected' | 'chord' | 'voicing'

function resolveHighlightKind(note: string, layers: HighlightLayers, voicingNotes: string[]): HighlightKind {
  if (containsNote(voicingNotes, note)) return 'voicing'
  if (containsNote(layers.chordNotes, note)) return 'chord'
  if (containsNote(layers.selectedNotes, note)) return 'selected'
  if (containsNote(layers.scaleNotes, note)) return 'scale'
  return 'none'
}

function markerClass(kind: HighlightKind) {
  if (kind === 'scale') return 'border-sky-400 bg-sky-500'
  if (kind === 'selected') return 'border-emerald-400 bg-emerald-500'
  if (kind === 'chord') return 'border-amber-400 bg-amber-500'
  if (kind === 'voicing') return 'border-fuchsia-400 bg-fuchsia-500'
  return ''
}

export function PianoKeyboard({
  root,
  viewMode,
  layers,
  voicingNotes = [],
  octaveStart = 2,
  octaveEnd = 5,
}: PianoKeyboardProps) {
  const keys = buildKeys(octaveStart, octaveEnd)
  const whiteKeys = keys.filter((key) => !key.isBlack)
  const blackKeys = keys.filter((key) => key.isBlack)
  const keyboardWidth = whiteKeys.length * WHITE_KEY_WIDTH

  return (
    <div className="grid gap-2">
      <p className="text-xs text-zinc-400">Teclado (espelho do fretboard)</p>
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 p-2">
        <div className="relative" style={{ width: `${keyboardWidth}px`, minWidth: `${keyboardWidth}px` }}>
          <div className="flex">
            {whiteKeys.map((key) => {
              const inScale = containsNote(layers.scaleNotes, key.note)
              const kind = resolveHighlightKind(key.note, layers, voicingNotes)
              const info = intervalInfo(key.note, root)

              return (
                <div
                  key={key.id}
                  title={`${key.note}${key.octave} • ${info.name} (${info.label})`}
                  className={cn(
                    'flex h-32 w-10 flex-col items-center justify-end border border-zinc-800 bg-zinc-100 px-1 pb-2 text-center text-[10px] font-semibold text-zinc-800',
                  )}
                >
                  <span>{keyLabel(key.note, root, viewMode, inScale)}</span>
                  {kind !== 'none' ? <span className={cn('mt-1 h-2.5 w-2.5 rounded-full border', markerClass(kind))} /> : null}
                </div>
              )
            })}
          </div>

          {blackKeys.map((key) => {
            const inScale = containsNote(layers.scaleNotes, key.note)
            const kind = resolveHighlightKind(key.note, layers, voicingNotes)
            const info = intervalInfo(key.note, root)
            const left = key.whiteIndex * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2

            return (
              <div
                key={key.id}
                title={`${key.note}${key.octave} • ${info.name} (${info.label})`}
                style={{ left: `${left}px`, width: `${BLACK_KEY_WIDTH}px` }}
                className={cn(
                  'absolute top-0 z-10 flex h-20 flex-col items-center justify-end rounded-b-md border border-zinc-900 bg-zinc-900 pb-2 text-[9px] font-semibold text-zinc-200',
                )}
              >
                <span>{keyLabel(key.note, root, viewMode, inScale)}</span>
                {kind !== 'none' ? <span className={cn('mt-1 h-2.5 w-2.5 rounded-full border', markerClass(kind))} /> : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
