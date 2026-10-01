# Proveniência dos Artefatos

Este diretório é a trilha de auditoria entre a pesquisa feita no ChatGPT e o repositório estruturado.

## Política

O repositório não precisa espelhar byte a byte os nomes originais para preservar a história. Em vez disso:

1. relatórios legíveis são arquivados como relatórios datados;
2. snapshots relevantes e superados ficam em `artifacts/source/` ou `artifacts/archive/`;
3. exports intermediários grandes podem ser normalizados em datasets canônicos;
4. cada artefato de origem é listado em `source-manifest.json` com nome original, caminho normalizado, data, tamanho, SHA-256 e representação no repositório;
5. conclusões vivas ficam em `docs/`; artefatos arquivados são evidência histórica, não verdade atual.

## Convenção de idioma

Os **paths do repositório são padronizados em inglês**. O conteúdo documental do projeto é mantido em **português do Brasil**. O campo de nome original no manifesto pode preservar a grafia original porque faz parte da proveniência.
