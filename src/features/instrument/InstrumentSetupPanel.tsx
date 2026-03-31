import { useEffect, useMemo, useState } from 'preact/hooks'
import { Card, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import type { NoteName } from '../../domain/music/notes'
import { NOTE_OPTIONS } from '../../lib/music-constants'
import { useHarmonyStore } from '../../state/useHarmonyStore'

const STORAGE_KEY = 'kcords.instrumentProfiles.v1'

type InstrumentProfile = {
  id: string
  name: string
  stringCount: 6 | 7
  fretCount: number
  tuning: NoteName[]
}

type InstrumentSetupPanelProps = {
  onClose?: () => void
}

function readProfiles(): InstrumentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as InstrumentProfile[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeProfiles(profiles: InstrumentProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export function InstrumentSetupPanel({ onClose }: InstrumentSetupPanelProps) {
  const stringCount = useHarmonyStore((s) => s.stringCount)
  const tuning = useHarmonyStore((s) => s.tuning)
  const setStringCount = useHarmonyStore((s) => s.setStringCount)
  const setTuningNote = useHarmonyStore((s) => s.setTuningNote)
  const fretCount = useHarmonyStore((s) => s.fretCount)
  const setFretCount = useHarmonyStore((s) => s.setFretCount)
  const setInstrumentConfig = useHarmonyStore((s) => s.setInstrumentConfig)

  const [profiles, setProfiles] = useState<InstrumentProfile[]>([])
  const [profileName, setProfileName] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')

  useEffect(() => {
    const loaded = readProfiles()
    setProfiles(loaded)
    if (loaded.length > 0) {
      setSelectedProfileId(loaded[0].id)
    }
  }, [])

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  )

  const saveCurrentProfile = () => {
    const name = profileName.trim() || `Perfil ${profiles.length + 1}`
    const profile: InstrumentProfile = {
      id: crypto.randomUUID(),
      name,
      stringCount,
      fretCount,
      tuning,
    }

    const updated = [profile, ...profiles]
    setProfiles(updated)
    setSelectedProfileId(profile.id)
    setProfileName('')
    writeProfiles(updated)
  }

  const applySelectedProfile = () => {
    if (!selectedProfile) {
      return
    }

    setInstrumentConfig({
      stringCount: selectedProfile.stringCount,
      fretCount: selectedProfile.fretCount,
      tuning: selectedProfile.tuning,
    })
  }

  const deleteSelectedProfile = () => {
    if (!selectedProfile) {
      return
    }

    const updated = profiles.filter((profile) => profile.id !== selectedProfile.id)
    setProfiles(updated)
    setSelectedProfileId(updated[0]?.id ?? '')
    writeProfiles(updated)
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between gap-3">
        <CardTitle>Instrumento</CardTitle>
        {onClose ? (
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3">
        <div className="grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <p className="text-xs text-zinc-400">Perfis salvos (localStorage)</p>

          <Select value={selectedProfileId} onChange={(event) => setSelectedProfileId(event.currentTarget.value)}>
            {profiles.length === 0 ? <option value="">Sem perfis salvos</option> : null}
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" onClick={applySelectedProfile} disabled={!selectedProfile}>
              Carregar perfil
            </Button>
            <Button variant="outline" size="sm" onClick={deleteSelectedProfile} disabled={!selectedProfile}>
              Excluir perfil
            </Button>
          </div>

          <input
            value={profileName}
            onInput={(event) => setProfileName(event.currentTarget.value)}
            placeholder="Nome do novo perfil"
            className="h-9 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          />
          <Button size="sm" onClick={saveCurrentProfile}>
            Salvar configuracao atual
          </Button>
        </div>

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
