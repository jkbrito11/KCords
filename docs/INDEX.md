# KCords Documentation Index

Objetivo: fornecer base solida para LLMs e desenvolvedores entenderem o projeto rapidamente.

## Ordem de leitura recomendada

1. [Project Overview](docs/PROJECT_OVERVIEW.md)
2. [Architecture](docs/ARCHITECTURE.md)
3. [Music Domain](docs/MUSIC_DOMAIN.md)
4. [State Model](docs/STATE_MODEL.md)
5. [UI Behavior](docs/UI_BEHAVIOR.md)
6. [Operations Runbook](docs/OPERATIONS_RUNBOOK.md)
7. [Backlog and Risks](docs/BACKLOG_AND_RISKS.md)

## Arquivos chave do codigo

- [App shell](src/app.tsx)
- [Global store](src/state/useHarmonyStore.ts)
- [Scale catalog](src/domain/music/scales.ts)
- [Harmony engine](src/domain/music/harmony.ts)
- [Voicing generator](src/domain/fretboard/voicings.ts)
- [Fretboard component](src/components/fretboard/Fretboard.tsx)
- [Piano mirror component](src/components/piano/PianoKeyboard.tsx)
