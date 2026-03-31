# Operations Runbook

## Setup local

1. `npm install`
2. `npm start`

Observacao: `npm start` usa `vite --host --port 5173`.
Se a 5173 estiver ocupada, Vite tenta outra porta automaticamente.

## Scripts

- `npm start`: sobe servidor com host externo e porta preferida 5173.
- `npm run dev`: servidor dev padrao.
- `npm run build`: validacao TypeScript + build de producao.
- `npm run preview`: preview local do build.

## Deploy

- Vercel: `npx vercel --prod --yes`
- GitHub remoto: `origin` em `https://github.com/jkbrito11/KCords.git`

## Publicacao tipica

1. `git status`
2. `git add ...`
3. `git commit -m "..."`
4. `git push origin master`

## Diagnostico rapido

- Build quebrando: rodar `npm run build` e corrigir TS primeiro.
- Dev server nao abre: checar porta ocupada e usar URL exibida pelo Vite.
- PWA: validar `manifest.webmanifest` e registro do `sw.js` em `src/main.tsx`.
