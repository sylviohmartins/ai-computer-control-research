# Política de contribuições

**Status:** Phase 0  
**Licença do core:** Apache License 2.0

## Princípio

Contribuições aceitas para o core público são submetidas sob os termos da Apache License 2.0, conforme a cláusula 5 da própria licença, salvo acordo escrito separado.

## Antes do primeiro código distribuível

O projeto deve:

- manter `LICENSE` na raiz;
- documentar claramente quais diretórios pertencem ao core Apache-2.0;
- evitar copiar código de terceiros sem revisão de licença;
- preservar notices exigidos por dependências;
- registrar dependências e licenças no processo de release;
- adotar SBOM antes do primeiro release público de binário.

## CLA/DCO

**Decisão inicial:** não exigir CLA proprietário na Phase 0.

Se o volume de contribuições externas justificar, o projeto pode adotar DCO/sign-off por decisão futura. Isso deve ser documentado antes de virar requisito de CI.

## Copyright

Cada contributor mantém os direitos que possui sobre sua contribuição e concede as permissões definidas pela Apache-2.0 ao submetê-la para inclusão.

## Marca

A contribuição de código não concede direito de representar forks ou derivados como produto oficial **Telechir**. Política de trademark será publicada antes de lançamento comercial relevante.

## Segurança

Contribuições que alterem:
- auth;
- pairing;
- policy;
- filesystem boundary;
- process execution;
- updater;
- secret handling

devem receber revisão explícita de segurança antes de merge.

## Artefatos históricos

`artifacts/` pode conter materiais anteriores à adoção formal da licença. Esses snapshots são evidência histórica e não devem ser tratados automaticamente como parte do core distribuível.
