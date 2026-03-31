import { useEffect, useMemo, useState } from 'preact/hooks'
import { Fretboard } from './components/fretboard/Fretboard'
import { FretboardLegend } from './components/fretboard/FretboardLegend'
import { PianoKeyboard } from './components/piano/PianoKeyboard'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { generateChordVoicings } from './domain/fretboard/voicings'
import { playChordByNames } from './lib/audio'
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
  const [chordDisplayMode, setChordDisplayMode] = useState<'full-neck' | 'voicings'>('full-neck')
  const [activeVoicingIndex, setActiveVoicingIndex] = useState(0)

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
  const chordVoicings = useMemo(
    () => (activeChord ? generateChordVoicings(tuning, fretCount, activeChord.notes, 10) : []),
    [activeChordKey, tuning, fretCount],
  )

  useEffect(() => {
    setActiveVoicingIndex((index) => {
      if (chordVoicings.length === 0) {
        return 0
      }
      return Math.min(index, chordVoicings.length - 1)
    })
  }, [chordVoicings.length])

  const selectedVoicing = chordVoicings[activeVoicingIndex] ?? null
  const selectedVoicingNotes = useMemo(
    () => (selectedVoicing ? [...new Set(selectedVoicing.positions.map((position) => position.note))] : []),
    [selectedVoicing],
  )

  const handleChordSelection = (chord: SelectableChord, source: 'manual' | 'harmony') => {
    if (activeChord && chordKey(activeChord) === chordKey(chord)) {
      setActiveChord(null)
      return
    }

    void playChordByNames(chord.notes, 3)
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

            {activeChord ? (
              <div className="grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-xs text-zinc-400">Modo de visualizacao do acorde</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={chordDisplayMode === 'full-neck' ? 'default' : 'outline'}
                    onClick={() => setChordDisplayMode('full-neck')}
                  >
                    Braco completo
                  </Button>
                  <Button
                    size="sm"
                    variant={chordDisplayMode === 'voicings' ? 'default' : 'outline'}
                    onClick={() => setChordDisplayMode('voicings')}
                  >
                    Digitacoes
                  </Button>
                </div>

                {chordDisplayMode === 'voicings' ? (
                  <div className="grid gap-1">
                    <p className="text-xs text-zinc-400">Forma da digitacao</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveVoicingIndex((index) => Math.max(index - 1, 0))}
                        disabled={chordVoicings.length === 0 || activeVoicingIndex === 0}
                      >
                        ←
                      </Button>
                      <div className="min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200">
                        {selectedVoicing ? selectedVoicing.label : 'Nenhuma digitacao encontrada'}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setActiveVoicingIndex((index) => Math.min(index + 1, Math.max(chordVoicings.length - 1, 0)))
                        }
                        disabled={
                          chordVoicings.length === 0 || activeVoicingIndex >= Math.max(chordVoicings.length - 1, 0)
                        }
                      >
                        →
                      </Button>
                    </div>
                    {selectedVoicing ? (
                      <p className="text-xs text-fuchsia-200">
                        Mostrando: {selectedVoicing.label} ({activeVoicingIndex + 1}/{chordVoicings.length})
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500">Tente outro acorde ou ajuste a afinação/casas.</p>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            <FretboardLegend />
            <Fretboard
              root={root}
              viewMode={fretboardViewMode}
              tuning={tuning}
              fretCount={fretCount}
              voicingPositions={chordDisplayMode === 'voicings' && selectedVoicing ? selectedVoicing.positions : []}
              layers={{
                scaleNotes: activeScaleNotes,
                chordNotes: chordDisplayMode === 'full-neck' ? activeChord?.notes ?? [] : [],
                selectedNotes,
              }}
            />

            <PianoKeyboard
              root={root}
              viewMode={fretboardViewMode}
              voicingNotes={chordDisplayMode === 'voicings' ? selectedVoicingNotes : []}
              layers={{
                scaleNotes: activeScaleNotes,
                chordNotes: chordDisplayMode === 'full-neck' ? activeChord?.notes ?? [] : [],
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
