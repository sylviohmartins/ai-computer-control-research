# ADR-0003: Tornar a Política Local do Dispositivo a Autoridade Final

- **Status:** Proposed
- **Data:** 2026-10-01

## Contexto

Um serviço hospedado ou cliente de IA pode ser comprometido, configurado incorretamente ou sofrer prompt injection. O control plane remoto não pode expandir silenciosamente as permissões máximas de um dispositivo.

## Decisão proposta

O agente local aplica o teto final de permissões. Políticas de cloud, conta ou sessão podem restringir ainda mais, mas nunca conceder permissões além do limite configurado localmente.

## Consequências

- comprometimento do control plane hospedado tem blast radius menor;
- configuração e recovery local se tornam security-critical;
- eventual sincronização de políticas enterprise deve preservar essa precedência ou substituir explicitamente este ADR.
