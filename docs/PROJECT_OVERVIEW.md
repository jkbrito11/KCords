# Project Overview

## Product

KCords e uma aplicacao web para estudo de harmonia musical aplicada a guitarra.

Pilares do produto:

- Visualizacao no fretboard com highlights de escala, acorde, selecao manual e digitacao.
- Espelho no teclado de piano para reforco de leitura horizontal (piano) e vertical (guitarra).
- Biblioteca de escalas e acordes contextual ao tom e escala ativos.
- Campo harmonico com acordes relativos.

## Stack

- Preact + TypeScript + Vite
- Tailwind CSS
- Zustand (estado global)
- Deploy: Vercel
- PWA manual via manifest + service worker

## Escopo funcional atual

- Setup de instrumento (6 e 7 cordas)
- Presets de afinacao de guitarra (6 cordas)
- Perfis de instrumento em localStorage
- Escalas diatonicas, modos, pentatonicas, menor harmonica, menor melodica
- Acordes triades e tetrades
- Matching reverso de escalas por 2+ notas
- Modos de acorde: braco completo e digitacoes
- Ordenacao de digitacoes pela tonica mais grave
- Label de inversao em digitacoes quando aplicavel
- Teclado de piano espelhando o estado do fretboard

## Linguagem e notacao

- UI em portugues (pt-BR sem acentos em boa parte dos labels por consistencia historica do projeto)
- Notas priorizam sustenidos: C, C#, D, D#, E, F, F#, G, G#, A, A#, B

## Objetivo de design tecnico

Manter dominio musical como fonte unica de verdade e UI como camada de apresentacao/interacao.
