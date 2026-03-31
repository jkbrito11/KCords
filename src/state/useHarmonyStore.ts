import { create } from 'zustand'
import { STANDARD_TUNING_6, STANDARD_TUNING_7 } from '../domain/fretboard/fretboard'
import type { NoteName } from '../domain/music/notes'

type ActiveChord = {
  name: string
  notes: string[]
  source: 'manual' | 'harmony'
}

type HarmonyState = {
  root: string
  scaleId: string
  stringCount: 6 | 7
  tuning: NoteName[]
  fretCount: number
  selectedNotes: string[]
  activeChord: ActiveChord | null
  setRoot: (root: string) => void
  setScaleId: (scaleId: string) => void
  setStringCount: (count: 6 | 7) => void
  setTuningNote: (index: number, note: NoteName) => void
  setFretCount: (fretCount: number) => void
  toggleSelectedNote: (note: string) => void
  clearSelectedNotes: () => void
  setActiveChord: (chord: ActiveChord | null) => void
}

export const useHarmonyStore = create<HarmonyState>((set) => ({
  root: 'C',
  scaleId: 'major',
  stringCount: 6,
  tuning: [...STANDARD_TUNING_6],
  fretCount: 15,
  selectedNotes: [],
  activeChord: null,
  setRoot: (root) => set({ root }),
  setScaleId: (scaleId) => set({ scaleId }),
  setStringCount: (stringCount) =>
    set({
      stringCount,
      tuning: stringCount === 7 ? [...STANDARD_TUNING_7] : [...STANDARD_TUNING_6],
    }),
  setTuningNote: (index, note) =>
    set((state) => {
      const tuning = [...state.tuning]
      tuning[index] = note
      return { tuning }
    }),
  setFretCount: (fretCount) => set({ fretCount }),
  toggleSelectedNote: (note) =>
    set((state) => {
      const selectedNotes = state.selectedNotes.includes(note)
        ? state.selectedNotes.filter((selected) => selected !== note)
        : [...state.selectedNotes, note]
      return { selectedNotes }
    }),
  clearSelectedNotes: () => set({ selectedNotes: [] }),
  setActiveChord: (activeChord) => set({ activeChord }),
}))
