import { Card, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { matchScalesByPitchSet } from '../../domain/music/matching'
import { playNoteByName } from '../../lib/audio'
import { NOTE_OPTIONS } from '../../lib/music-constants'
import { cn } from '../../lib/utils'
import { useHarmonyStore } from '../../state/useHarmonyStore'

export function ScaleFinderByNotesPanel() {
  const selectedNotes = useHarmonyStore((s) => s.selectedNotes)
  const toggleSelectedNote = useHarmonyStore((s) => s.toggleSelectedNote)
  const clearSelectedNotes = useHarmonyStore((s) => s.clearSelectedNotes)
  const setRoot = useHarmonyStore((s) => s.setRoot)
  const setScaleId = useHarmonyStore((s) => s.setScaleId)

  const matches = matchScalesByPitchSet(selectedNotes, 0.5)

  return (
    <Card>
      <CardTitle>Seletor de notas para buscar escalas</CardTitle>
      <div className="mt-3 grid gap-3">
        <p className="text-xs text-zinc-400">Selecione 2 ou mais notas para encontrar escalas compatíveis.</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {NOTE_OPTIONS.map((note) => {
            const active = selectedNotes.includes(note)
            return (
              <button
                key={note}
                type="button"
                onClick={() => {
                  toggleSelectedNote(note)
                  void playNoteByName(note, 4)
                }}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800',
                )}
              >
                {note}
              </button>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={clearSelectedNotes}>
            Limpar selecao
          </Button>
        </div>

        <div className="space-y-2">
          {matches.length === 0 && <p className="text-xs text-zinc-500">Sem resultados ainda. Selecione mais notas.</p>}
          {matches.map((match) => (
            <button
              key={`${match.root}-${match.scaleId}`}
              type="button"
              onClick={() => {
                setRoot(match.root)
                setScaleId(match.scaleId)
              }}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 p-2 text-left text-xs text-zinc-200 hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {match.root} {match.scaleName}
                </span>
                <span className="text-zinc-400">{Math.round(match.score * 100)}%</span>
              </div>
              <p className="mt-1 text-zinc-400">Match: {match.matched.join(', ') || '-'}</p>
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
