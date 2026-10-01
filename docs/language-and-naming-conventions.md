# Convenções de Idioma e Nomenclatura

## Objetivo

Manter o repositório previsível para pessoas, ferramentas e agentes de IA sem perder a preferência do projeto por documentação em português do Brasil.

## Regra principal

- **arquivos e diretórios:** inglês, em `kebab-case` quando aplicável;
- **documentação humana:** português do Brasil;
- **código, símbolos, nomes de packages, schemas e APIs:** inglês;
- **branches e commits:** inglês por padrão;
- **nomes oficiais de produtos e protocolos:** não traduzir;
- **comandos, flags e snippets:** manter sintaxe original;
- **artefatos históricos:** podem preservar conteúdo original se uma tradução destruir a fidelidade histórica.

## Datas em arquivos

Snapshots datados devem preferir:

`YYYY-MM-DD-descriptive-name.ext`

Exemplo:

`2026-10-01-naming-discovery-report.md`

## Conteúdo estruturado

CSV/JSON podem usar nomes de campos em inglês para interoperabilidade. Valores editoriais criados pelo projeto devem preferir PT-BR; nomes próprios, status machine-readable e termos oficiais podem permanecer em inglês.

## Status e gates

Constantes como `NAME_READY`, `NAME_CONDITIONAL` e `NAME_NOT_READY` permanecem em inglês porque funcionam como identificadores estáveis.
