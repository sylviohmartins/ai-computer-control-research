# ADR-0003: Tornar a Política Local do Dispositivo a Autoridade Final

- **Status:** Accepted
- **Data:** 2026-10-01
- **Aceito em:** 2026-10-02

## Contexto

Um serviço hospedado ou cliente de IA pode ser comprometido, configurado incorretamente ou sofrer prompt injection. O control plane remoto não pode expandir silenciosamente as permissões máximas de um dispositivo.

## Decisão

O agent local aplica o teto final de permissões. Políticas de cloud, conta, workspace, sessão ou cliente podem restringir ainda mais, mas nunca conceder permissões além do limite configurado localmente.

Precedência conceitual:

hard deny local > device policy > workspace restriction > cloud restriction > session grant > client requested scope.

## Consequências

- comprometimento do control plane hospedado tem blast radius menor;
- configuração e recovery local se tornam security-critical;
- approvals remotos não substituem confirmação local quando a policy exige;
- eventual sincronização enterprise precisa preservar essa precedência ou substituir formalmente este ADR;
- todos os tool contracts e device commands devem ser revalidados no agent imediatamente antes do side effect.

## Evidência

A decisão está detalhada em:
- `specs/policy/authorization-and-approvals.md`;
- `docs/security/threat-model/stride-baseline-2026-10-02.md`.
