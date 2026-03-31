# KCords

Aplicacao de apoio ao estudo de harmonia musical para guitarristas, com foco em visualizacao no fretboard.

## Versao

- v1.0.0 estavel

## Stack

- Preact + TypeScript (Vite)
- Tailwind CSS
- Componentes no padrao shadcn/ui
- Zustand para estado global

## Funcionalidades implementadas na base

- Fretboard dinamico por afinacao configuravel
- Suporte para guitarra de 6 e 7 cordas
- Biblioteca de escalas (diatonicas, pentatonicas e modos)
- Manual de acordes em triades e tetrades
- Busca reversa de escalas por selecao de 2 ou mais notas
- Campo harmonico (triades e tetrades) com destaque no fretboard
- Exibicao de opcoes de acordes relativos

## Execucao

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Documentacao para LLMs

- [Indice de documentacao](docs/INDEX.md)
- [Visao geral do projeto](docs/PROJECT_OVERVIEW.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Dominio musical](docs/MUSIC_DOMAIN.md)
- [Modelo de estado](docs/STATE_MODEL.md)
- [Comportamentos de UI](docs/UI_BEHAVIOR.md)
- [Runbook operacional](docs/OPERATIONS_RUNBOOK.md)
- [Backlog e riscos](docs/BACKLOG_AND_RISKS.md)
