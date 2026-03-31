import { noteToSemitone } from '../domain/music/notes'

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null
  }

  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) {
    return null
  }

  if (!audioContext) {
    audioContext = new Ctx()
  }

  return audioContext
}

function midiFromNote(note: string, octave: number): number {
  const semitone = noteToSemitone(note)
  return (octave + 1) * 12 + semitone
}

function frequencyFromMidi(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function playFrequency(frequency: number, startTime: number, duration = 0.25, peakGain = 0.12) {
  const ctx = getAudioContext()
  if (!ctx) {
    return
  }

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(frequency, startTime)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

export async function playNoteByName(note: string, octave = 4) {
  const ctx = getAudioContext()
  if (!ctx) {
    return
  }

  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const now = ctx.currentTime
  const midi = midiFromNote(note, octave)
  playFrequency(frequencyFromMidi(midi), now, 0.22)
}

export async function playChordByNames(notes: string[], octave = 4) {
  const ctx = getAudioContext()
  if (!ctx || notes.length === 0) {
    return
  }

  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const now = ctx.currentTime
  notes.forEach((note, index) => {
    const midi = midiFromNote(note, octave) + (index > 1 ? 12 : 0)
    playFrequency(frequencyFromMidi(midi), now + index * 0.03, 0.3)
  })
}

export async function playVoicingPhraseByNames(notes: string[], octave = 3) {
  const ctx = getAudioContext()
  const uniqueNotes = [...new Set(notes)]

  if (!ctx || uniqueNotes.length === 0) {
    return
  }

  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const now = ctx.currentTime
  const arpeggioStep = 0.16
  const arpeggioDuration = 0.36

  uniqueNotes.forEach((note, index) => {
    const midi = midiFromNote(note, octave) + Math.floor(index / 2) * 12
    playFrequency(frequencyFromMidi(midi), now + index * arpeggioStep, arpeggioDuration, 0.11)
  })

  const blockStart = now + uniqueNotes.length * arpeggioStep + 0.1
  uniqueNotes.forEach((note, index) => {
    const midi = midiFromNote(note, octave) + Math.floor(index / 2) * 12
    playFrequency(frequencyFromMidi(midi), blockStart, 0.65, 0.09)
  })
}
