import { Card, CardTitle } from '../../components/ui/card'
import { Select } from '../../components/ui/select'
import { SCALE_LIBRARY, scaleNotes } from '../../domain/music/scales'
import { NOTE_OPTIONS } from '../../lib/music-constants'
import { useHarmonyStore } from '../../state/useHarmonyStore'

export function ScaleLibraryPanel() {
  const root = useHarmonyStore((s) => s.root)
  const scaleId = useHarmonyStore((s) => s.scaleId)
  const fretboardViewMode = useHarmonyStore((s) => s.fretboardViewMode)
  const setRoot = useHarmonyStore((s) => s.setRoot)
  const setScaleId = useHarmonyStore((s) => s.setScaleId)
  const setFretboardViewMode = useHarmonyStore((s) => s.setFretboardViewMode)

  const currentScaleNotes = scaleNotes(root, scaleId)

  return (
    <Card>
      <CardTitle>Biblioteca de escalas</CardTitle>
      <div className="mt-3 grid gap-3">
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs text-zinc-400">
            Tonica
            <Select value={root} onChange={(event) => setRoot(event.currentTarget.value)}>
              {NOTE_OPTIONS.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1 text-xs text-zinc-400">
            Escala
            <Select value={scaleId} onChange={(event) => setScaleId(event.currentTarget.value)}>
              {SCALE_LIBRARY.map((scale) => (
                <option key={scale.id} value={scale.id}>
                  {scale.name}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <label className="grid gap-1 text-xs text-zinc-400">
          Exibicao no fretboard
          <Select value={fretboardViewMode} onChange={(event) => setFretboardViewMode(event.currentTarget.value as 'notes' | 'intervals')}>
            <option value="notes">Notas</option>
            <option value="intervals">Intervalos da escala</option>
          </Select>
        </label>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
          <p className="text-zinc-400">Notas da escala ativa</p>
          <p className="mt-1 font-medium text-zinc-100">{currentScaleNotes.join(' - ')}</p>
        </div>
      </div>
    </Card>
  )
}
