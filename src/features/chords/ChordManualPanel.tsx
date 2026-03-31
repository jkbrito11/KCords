import { useState } from 'preact/hooks'
import { Card, CardTitle } from '../../components/ui/card'
import { Select } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { CHORD_LIBRARY, chordNotes } from '../../domain/music/chords'
import { harmonicField, scaleLabel } from '../../domain/music/harmony'
import { useHarmonyStore } from '../../state/useHarmonyStore'

type ChordManualPanelProps = {
  activeChordKey: string | null
  onSelectChord: (chord: { name: string; notes: string[] }) => void
}

export function ChordManualPanel({ activeChordKey, onSelectChord }: ChordManualPanelProps) {
  const root = useHarmonyStore((s) => s.root)
  const scaleId = useHarmonyStore((s) => s.scaleId)
  const [chordId, setChordId] = useState<string>('maj')

  const chord = CHORD_LIBRARY.find((item) => item.id === chordId) ?? CHORD_LIBRARY[0]
  const notes = chordNotes(root, chord.id)
  const currentKey = `${root}${chord.symbol}:${notes.join('-')}`
  const isActive = activeChordKey === currentKey
  const triads = harmonicField(root, scaleId, 3)
  const tetrads = harmonicField(root, scaleId, 4)

  const isContextChordActive = (name: string, chordNotesList: string[]) => activeChordKey === `${name}:${chordNotesList.join('-')}`

  return (
    <Card>
      <CardTitle>Manual de acordes (contextual ao tom/escala)</CardTitle>
      <div className="mt-3 grid gap-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
          <p className="text-zinc-400">Contexto atual</p>
          <p className="mt-1 font-medium text-zinc-100">
            Tom: {root} | Escala: {scaleLabel(scaleId)}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-xs font-semibold text-zinc-200">Tríades diatônicas</p>
            <div className="mt-2 grid gap-2">
              {triads.map((contextChord) => (
                <Button
                  key={`manual-triad-${contextChord.degree}`}
                  variant={isContextChordActive(contextChord.name, contextChord.notes) ? 'default' : 'outline'}
                  size="sm"
                  className="justify-between"
                  onClick={() => onSelectChord({ name: contextChord.name, notes: contextChord.notes })}
                >
                  {contextChord.roman} - {contextChord.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-xs font-semibold text-zinc-200">Tétrades diatônicas</p>
            <div className="mt-2 grid gap-2">
              {tetrads.map((contextChord) => (
                <Button
                  key={`manual-tetrad-${contextChord.degree}`}
                  variant={isContextChordActive(contextChord.name, contextChord.notes) ? 'default' : 'outline'}
                  size="sm"
                  className="justify-between"
                  onClick={() => onSelectChord({ name: contextChord.name, notes: contextChord.notes })}
                >
                  {contextChord.roman} - {contextChord.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label className="grid gap-1 text-xs text-zinc-400">
            Acorde manual sobre a tônica selecionada ({root})
            <Select value={chordId} onChange={(event) => setChordId(event.currentTarget.value)}>
              {CHORD_LIBRARY.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
          <p className="text-zinc-400">Notas do acorde</p>
          <p className="mt-1 font-medium text-zinc-100">{notes.join(' - ')}</p>
        </div>

        <Button
          variant={isActive ? 'default' : 'secondary'}
          onClick={() =>
            onSelectChord({
              name: `${root}${chord.symbol}`,
              notes,
            })
          }
        >
          {isActive ? 'Remover highlight do acorde' : 'Destacar acorde no fretboard'}
        </Button>
      </div>
    </Card>
  )
}
