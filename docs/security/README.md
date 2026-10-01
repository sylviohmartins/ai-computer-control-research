# Discovery de Segurança

Segurança é uma capability do produto, não uma etapa posterior de hardening.

Direção atual:

- policy local do dispositivo deve ser a autoridade final;
- permissões usam semântica explícita allow / ask / deny;
- operações perigosas exigem aprovação mais forte ou permanecem negadas;
- autorização de filesystem deve operar sobre paths resolvidos/canônicos;
- identidade do dispositivo, revogação e sessões curtas são preocupações de primeira classe;
- host, guarded-host e sandbox são modos de segurança distintos;
- secrets devem ser referenciados/injetados sem expor valores desnecessariamente ao modelo.

O threat model atual ainda é artefato de discovery e só será congelado em especificação formal após o Blueprint v2.
