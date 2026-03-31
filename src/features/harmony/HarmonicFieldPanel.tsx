import { Card, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { harmonicField, relativeOptions, scaleLabel } from '../../domain/music/harmony'

type HarmonicFieldPanelProps = {
  root: string
  scaleId: string
  activeChordKey: string | null
  onSelectChord: (chord: { name: string; notes: string[] }) => void
}

function chordKey(chord: { name: string; notes: string[] }) {
  return `${chord.name}:${chord.notes.join('-')}`
}

export function HarmonicFieldPanel({ root, scaleId, activeChordKey, onSelectChord }: HarmonicFieldPanelProps) {
  const triads = harmonicField(root, scaleId, 3)
  const tetrads = harmonicField(root, scaleId, 4)
  const relatives = relativeOptions(root, scaleId)

  return (
    <Card>
      <CardTitle>Campo harmonico e acordes relativos</CardTitle>
      <div className="mt-3 grid gap-3">
        <p className="text-xs text-zinc-400">
          Campo harmonico de {root} {scaleLabel(scaleId)}
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-xs font-semibold text-zinc-200">Triades</p>
            <div className="mt-2 grid gap-2">
              {triads.map((chord) => {
                const isActive = chordKey({ name: chord.name, notes: chord.notes }) === activeChordKey

                return (
                  <Button
                    key={`triad-${chord.degree}`}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelectChord({ name: chord.name, notes: chord.notes })}
                    className="justify-between"
                  >
                    <span>
                      {chord.roman} - {chord.name}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-xs font-semibold text-zinc-200">Tetrades</p>
            <div className="mt-2 grid gap-2">
              {tetrads.map((chord) => {
                const isActive = chordKey({ name: chord.name, notes: chord.notes }) === activeChordKey

                return (
                  <Button
                    key={`tetrad-${chord.degree}`}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelectChord({ name: chord.name, notes: chord.notes })}
                    className="justify-between"
                  >
                    <span>
                      {chord.roman} - {chord.name}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200">
          <p className="font-semibold">Opcoes relativas</p>
          <ul className="mt-2 space-y-1 text-zinc-300">
            {relatives.map((relative) => (
              <li key={`${relative.label}-${relative.root}-${relative.scaleId}`}>
                {relative.label}: {relative.root} {scaleLabel(relative.scaleId)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
