import { useState } from 'preact/hooks'
import { Card, CardTitle } from '../../components/ui/card'
import { Select } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { CHORD_LIBRARY, chordNotes } from '../../domain/music/chords'
import { NOTE_OPTIONS } from '../../lib/music-constants'

type ChordManualPanelProps = {
  onSelectChord: (chord: { name: string; notes: string[] }) => void
}

export function ChordManualPanel({ onSelectChord }: ChordManualPanelProps) {
  const [root, setRoot] = useState<string>('C')
  const [chordId, setChordId] = useState<string>('maj')

  const chord = CHORD_LIBRARY.find((item) => item.id === chordId) ?? CHORD_LIBRARY[0]
  const notes = chordNotes(root, chord.id)

  return (
    <Card>
      <CardTitle>Manual de acordes (triades e tetrades)</CardTitle>
      <div className="mt-3 grid gap-3">
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs text-zinc-400">
            Fundamental
            <Select value={root} onChange={(event) => setRoot(event.currentTarget.value)}>
              {NOTE_OPTIONS.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1 text-xs text-zinc-400">
            Acorde
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
          onClick={() =>
            onSelectChord({
              name: `${root}${chord.symbol}`,
              notes,
            })
          }
        >
          Destacar acorde no fretboard
        </Button>
      </div>
    </Card>
  )
}
