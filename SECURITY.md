# Política de Segurança

Segurança é uma preocupação central porque o produto pretendido poderá futuramente executar ações em computadores autorizados.

## Não divulgue relatos sensíveis publicamente

Não abra issue pública contendo credenciais, tokens, chaves privadas, detalhes privados de infraestrutura, passos de exploração contra deployment ativo ou outro material sensível.

Se o GitHub Private Vulnerability Reporting estiver disponível, utilize esse canal. Caso contrário, contate o proprietário por um canal privado associado ao GitHub antes de compartilhar detalhes acionáveis.

## Estado atual da implementação

Não existe runtime de produção ou serviço implantado neste repositório. Relatos de segurança neste momento provavelmente envolverão artefatos de pesquisa, hipóteses de arquitetura, dependências sugeridas ou exposição acidental de secrets.

## Princípios de segurança em avaliação

- conectividade iniciada pelo dispositivo;
- credenciais de curta duração e identidade explícita do dispositivo;
- enforcement local de menor privilégio;
- typed tools em vez de command execution irrestrito sempre que possível;
- approvals explícitos para ações de alto risco;
- ações auditáveis e revogáveis;
- isolamento progressivo por guarded-host e sandbox.
