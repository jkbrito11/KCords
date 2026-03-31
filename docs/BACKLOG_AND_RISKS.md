# Backlog and Risks

## Backlog tecnico

1. Adicionar testes unitarios para dominio musical.
2. Adicionar testes de integracao para sincronizacao UI/store/highlights.
3. Implementar busca/filtro textual na biblioteca de escalas.
4. Consolidar refinamentos de responsividade e estados vazios.
5. Opcional: alias de paths no TypeScript/Vite.

## Riscos conhecidos

1. Geracao de voicings e heuristica simples (nao cobre todas as praticas de guitarra).
2. PWA manual com cache basico (sem estrategia avancada de atualizacao).
3. Labels em pt-BR sem acento por historico do projeto (pode exigir revisao editorial).

## Regras para futuras contribuicoes por LLM

1. Nao quebrar ids estaveis de escala/acorde usados no estado e matching.
2. Preservar prioridade de sustenidos na exibicao.
3. Manter toggle de selecao de acorde.
4. Ao alterar voicings, validar tetrades com 4 notas distintas.
5. Sempre rodar `npm run build` antes de commit.
