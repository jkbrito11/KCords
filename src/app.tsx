import { useState } from 'preact/hooks'
import { Fretboard } from './components/fretboard/Fretboard'
import { FretboardLegend } from './components/fretboard/FretboardLegend'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { scaleNotes } from './domain/music/scales'
import { ChordManualPanel } from './features/chords/ChordManualPanel'
import { HarmonicFieldPanel } from './features/harmony/HarmonicFieldPanel'
import { InstrumentSetupPanel } from './features/instrument/InstrumentSetupPanel'
import { ScaleFinderByNotesPanel } from './features/scales/ScaleFinderByNotesPanel'
import { ScaleLibraryPanel } from './features/scales/ScaleLibraryPanel'
import { useHarmonyStore } from './state/useHarmonyStore'

type SelectableChord = {
  name: string
  notes: string[]
}

function chordKey(chord: SelectableChord) {
  return `${chord.name}:${chord.notes.join('-')}`
}

export function App() {
  const [instrumentMenuOpen, setInstrumentMenuOpen] = useState(false)

  const root = useHarmonyStore((state) => state.root)
  const scaleId = useHarmonyStore((state) => state.scaleId)
  const fretboardViewMode = useHarmonyStore((state) => state.fretboardViewMode)
  const tuning = useHarmonyStore((state) => state.tuning)
  const stringCount = useHarmonyStore((state) => state.stringCount)
  const fretCount = useHarmonyStore((state) => state.fretCount)
  const selectedNotes = useHarmonyStore((state) => state.selectedNotes)
  const activeChord = useHarmonyStore((state) => state.activeChord)
  const setActiveChord = useHarmonyStore((state) => state.setActiveChord)

  const activeScaleNotes = scaleNotes(root, scaleId)
  const activeChordKey = activeChord ? chordKey(activeChord) : null

  const handleChordSelection = (chord: SelectableChord, source: 'manual' | 'harmony') => {
    if (activeChord && chordKey(activeChord) === chordKey(chord)) {
      setActiveChord(null)
      return
    }

    setActiveChord({ name: chord.name, notes: chord.notes, source })
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] p-3 sm:p-6">
      <header className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-4xl">KCords</h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-300 sm:text-base">
              Plataforma de harmonia para guitarristas com fretboard interativo, biblioteca de escalas, manual de
              acordes, campo harmonico e busca reversa por selecao de notas.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button variant="secondary" onClick={() => setInstrumentMenuOpen(true)}>
              Configurar instrumento
            </Button>
            <p className="text-xs text-zinc-400">
              {stringCount} cordas • {fretCount} casas • Afinacao: {tuning.join(' ')}
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[370px_minmax(0,1fr)]">
        <div className="grid gap-4">
          <ScaleLibraryPanel />
          <ChordManualPanel activeChordKey={activeChordKey} onSelectChord={(chord) => handleChordSelection(chord, 'manual')} />
          <ScaleFinderByNotesPanel />
        </div>

        <div className="grid gap-4">
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Fretboard</h2>
                <p className="text-xs text-zinc-400">
                  Escala ativa: {root} {scaleId.replace('_', ' ')}
                </p>
              </div>
              {activeChord ? (
                <p className="text-xs text-amber-200">
                  Acorde em destaque: <span className="font-semibold">{activeChord.name}</span>
                </p>
              ) : (
                <p className="text-xs text-zinc-500">Selecione um acorde para destacar no fretboard.</p>
              )}
            </div>

            <FretboardLegend />
            <Fretboard
              root={root}
              viewMode={fretboardViewMode}
              tuning={tuning}
              fretCount={fretCount}
              layers={{
                scaleNotes: activeScaleNotes,
                chordNotes: activeChord?.notes ?? [],
                selectedNotes,
              }}
            />
          </Card>

          <HarmonicFieldPanel
            root={root}
            scaleId={scaleId}
            activeChordKey={activeChordKey}
            onSelectChord={(chord) => handleChordSelection(chord, 'harmony')}
          />
        </div>
      </section>

      {instrumentMenuOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/70 backdrop-blur-sm">
          <button
            type="button"
            className="h-full flex-1 cursor-default"
            aria-label="Fechar menu de instrumento"
            onClick={() => setInstrumentMenuOpen(false)}
          />
          <aside className="h-full w-full max-w-md overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-3 sm:p-4">
            <InstrumentSetupPanel onClose={() => setInstrumentMenuOpen(false)} />
          </aside>
        </div>
      ) : null}
    </main>
  )
}
