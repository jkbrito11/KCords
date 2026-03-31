# Architecture

## Mapa de pastas

- `src/domain/music`: regras de notas, escalas, acordes, campo harmonico e matching.
- `src/domain/fretboard`: mapeamento de braco, highlights e geracao de digitacoes.
- `src/state`: store global Zustand.
- `src/features`: paineis funcionais (escala, acordes, instrumento, harmonia).
- `src/components`: componentes visuais reutilizaveis (fretboard, piano, ui base).
- `src/lib`: utilitarios e constantes.

## Fluxo principal de dados

1. Usuario altera root/scale/instrument/chord na UI.
2. `useHarmonyStore` atualiza estado global.
3. Dominio musical calcula notas de escala, acordes, campo harmonico e relativos.
4. UI renderiza highlights no fretboard e no piano.
5. Opcionalmente, dominio de voicings calcula formas de digitacao.

## Componentes centrais

- `src/app.tsx`: orquestracao dos paineis, modos de acorde e sincronizacao das camadas.
- `src/components/fretboard/Fretboard.tsx`: grade de corda x casa, labels e marcacoes de braco.
- `src/components/piano/PianoKeyboard.tsx`: espelho do estado musical em teclas piano.

## PWA

Implementacao manual:

- `public/manifest.webmanifest`
- `public/sw.js`
- registro em `src/main.tsx`

## Deploy

- Repositorio GitHub: jkbrito11/KCords
- Vercel em producao com build `npm run build`
