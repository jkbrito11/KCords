# Music Domain

## Notas e enarmonia

Arquivo: `src/domain/music/notes.ts`

- Normalizacao converte entradas para classe em sustenidos.
- Conversao semitonal usa `CHROMATIC_SHARPS` como referencia principal.
- Regras atuais priorizam sustenido em exibicao.

## Escalas

Arquivo: `src/domain/music/scales.ts`

Catalogo atual inclui:

- Maior (Jonio)
- Menor Natural (Aeolio)
- Menor Harmonica
- Menor Melodica
- Dorico, Frigio, Lidio, Mixolidio, Locrio
- Pentatonica Maior, Pentatonica Menor

Funcao chave:

- `scaleNotes(root, scaleId)` -> notas da escala no contexto atual.

## Acordes

Arquivo: `src/domain/music/chords.ts`

- Biblioteca de triades e tetrades por formula intervalar.
- Simbolos mantidos para composicao textual (`m`, `maj7`, `m7b5`, etc).

Funcao chave:

- `chordNotes(root, chordId)` -> notas do acorde.

## Harmonia e relativos

Arquivo: `src/domain/music/harmony.ts`

Funcoes:

- `harmonicField(root, scaleId, depth)` -> acordes por grau (triades/tetrades).
- `relativeOptions(root, scaleId)` -> sugestoes de contexto relativo.

## Matching reverso

Arquivo: `src/domain/music/matching.ts`

- Entrada: conjunto de notas selecionadas (>=2).
- Saida: escalas candidatas com score de cobertura.

## Digitacoes

Arquivo: `src/domain/fretboard/voicings.ts`

- Gera voicings a partir de notas de acorde.
- Para tetrade exige 4 notas distintas.
- Ordena formas por tonica mais grave para mais aguda.
- Adiciona label de inversao quando detectada.
