# State Model

Arquivo principal: `src/state/useHarmonyStore.ts`

## Estado global

- `root`: tonica ativa.
- `scaleId`: escala ativa.
- `fretboardViewMode`: `notes` ou `intervals`.
- `stringCount`: 6 ou 7.
- `tuning`: afinacao atual.
- `fretCount`: numero de casas exibidas.
- `selectedNotes`: selecao manual de notas.
- `activeChord`: acorde atualmente destacado.

## Acoes

- `setRoot`, `setScaleId`, `setFretboardViewMode`
- `setStringCount`, `setTuningNote`, `setFretCount`
- `setInstrumentConfig` (aplicacao atomica de perfil/preset)
- `toggleSelectedNote`, `clearSelectedNotes`
- `setActiveChord`

## Regras de UX derivadas do estado

- Toggle de acorde: clicar no mesmo acorde remove highlight.
- Modo de acorde (braco completo vs digitacoes) e mantido ao trocar acorde.
- Indice da digitacao e truncado para faixa valida quando lista muda.
