import { Card, CardTitle } from '../../components/ui/card'
import { Select } from '../../components/ui/select'
import type { NoteName } from '../../domain/music/notes'
import { NOTE_OPTIONS } from '../../lib/music-constants'
import { useHarmonyStore } from '../../state/useHarmonyStore'

export function InstrumentSetupPanel() {
  const stringCount = useHarmonyStore((s) => s.stringCount)
  const tuning = useHarmonyStore((s) => s.tuning)
  const setStringCount = useHarmonyStore((s) => s.setStringCount)
  const setTuningNote = useHarmonyStore((s) => s.setTuningNote)
  const fretCount = useHarmonyStore((s) => s.fretCount)
  const setFretCount = useHarmonyStore((s) => s.setFretCount)

  return (
    <Card>
      <CardTitle>Instrumento</CardTitle>
      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-xs text-zinc-400">
          Numero de cordas
          <Select value={stringCount} onChange={(event) => setStringCount(Number(event.currentTarget.value) as 6 | 7)}>
            <option value={6}>Guitarra 6 cordas (E A D G B E)</option>
            <option value={7}>Guitarra 7 cordas (B E A D G B E)</option>
          </Select>
        </label>

        <label className="grid gap-1 text-xs text-zinc-400">
          Casas exibidas
          <Select value={fretCount} onChange={(event) => setFretCount(Number(event.currentTarget.value))}>
            <option value={12}>12</option>
            <option value={15}>15</option>
            <option value={18}>18</option>
            <option value={21}>21</option>
          </Select>
        </label>

        <div className="grid gap-2">
          <p className="text-xs text-zinc-400">Afinacao por corda (grave para aguda)</p>
          <div className="grid grid-cols-2 gap-2">
            {tuning.map((note, index) => (
              <label key={`tuning-${index}`} className="grid gap-1 text-xs text-zinc-400">
                Corda {index + 1}
                <Select value={note} onChange={(event) => setTuningNote(index, event.currentTarget.value as NoteName)}>
                  {NOTE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
