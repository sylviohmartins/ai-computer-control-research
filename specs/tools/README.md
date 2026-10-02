# Public Tool Contracts — MVP

**Tool schema version:** `0.1`

Este documento define a superfície pública de tools do primeiro vertical slice. Os contratos estruturados ficam em `public-tools.schema.json`; `tool-catalog.json` liga nome, schemas, OAuth e operação interna.

## Princípios

- nomes públicos MCP usam `snake_case` e descrevem uma ação;
- identificadores de domínio/protocolo usam nomes pontuados, como `fs.read` e `process.start`;
- cada operação é exposta individualmente;
- authorization no serviço e policy final no device;
- resultados não retornam secrets ou telemetria interna;
- operações longas usam handles explícitos;
- alterações de estado têm annotations conservadoras e critérios de aprovação.

## Dois namespaces, sem ambiguidade

Os headings históricos dos acceptance criteria (`device.list`, `fs.read`, `shell.exec`, `process.start` etc.) são os **identificadores canônicos de domínio/operação interna**. A interface MCP pública usa os nomes `snake_case` abaixo.

O adapter MCP deve usar esta tabela; não deve inferir nomes durante a implementação.

| Tool pública MCP | Operação interna | Plano de execução | Scope OAuth |
|---|---|---|---|
| `list_devices` | `device.list` | control-plane | `telechir:devices:read` |
| `get_device` | `device.info` | control-plane | `telechir:devices:read` |
| `list_files` | `fs.list` | device | `telechir:files:read` |
| `get_file_metadata` | `fs.stat` | device | `telechir:files:read` |
| `read_file` | `fs.read` | device | `telechir:files:read` |
| `write_file` | `fs.write` | device | `telechir:files:write` |
| `patch_file` | `fs.patch` | device | `telechir:files:write` |
| `search_files` | `fs.search` | device | `telechir:files:read` |
| `run_command` | `shell.exec` | device | `telechir:processes:write` |
| `start_process` | `process.start` | device | `telechir:processes:write` |
| `read_process_output` | `process.read` | device | `telechir:processes:read` |
| `write_process_input` | `process.write` | device | `telechir:processes:write` |
| `cancel_process` | `process.cancel` | device | `telechir:processes:write` |
| `list_managed_processes` | `process.list` | device | `telechir:processes:read` |
| `get_git_status` | `git.status` | device | `telechir:git:read` |
| `get_git_diff` | `git.diff` | device | `telechir:git:read` |
| `get_system_metrics` | `system.metrics` | device | `telechir:metrics:read` |
| `get_artifact` | `artifact.get` | control-plane | `telechir:artifacts:read` |

As operações `device.list`, `device.info` e `artifact.get` são resolvidas no control plane; não viram `command.request` para o device.

## Normalização MCP → device command

Para tools executadas no device:

1. validar o input público contra `public-tools.schema.json`;
2. autenticar usuário/client e aplicar scopes;
3. extrair `device_id` para routing;
4. resolver a operação interna pelo `tool-catalog.json`;
5. construir `command.request.arguments` com os argumentos de negócio restantes;
6. gerar/propagar `command_id` e `idempotency_key` internos;
7. revalidar o payload contra os schemas de `specs/protocol/`.

A `idempotency_key` do device protocol protege retries do **mesmo comando interno**. Ela é gerada/propagada pelo control plane e permanece estável entre retries do canal. `start_process` também expõe uma key no contrato público 0.1 para permitir deduplicação quando o próprio cliente repete uma chamada cujo resultado ficou incerto. Demais tools não devem ser automaticamente repetidas como novas chamadas MCP apenas porque o transporte perdeu a resposta.

## Catálogo

`list_devices`, `get_device`, `list_files`, `get_file_metadata`, `read_file`, `write_file`, `patch_file`, `search_files`, `run_command`, `start_process`, `read_process_output`, `write_process_input`, `cancel_process`, `list_managed_processes`, `get_git_status`, `get_git_diff`, `get_system_metrics`, `get_artifact`.

## Schemas e autorização

Cada entrada de `tool-catalog.json` contém:
- `input_schema_ref`;
- `output_schema_ref`;
- `securitySchemes` com OAuth scopes explícitos;
- `internal_operation`;
- `execution_plane`.

A implementação OpenAI/MCP pode espelhar `securitySchemes` em `_meta.securitySchemes` quando necessário por compatibilidade, mas o array top-level é a fonte de verdade.

## Long-running work

`start_process` retorna `process_id`. O cliente usa `read_process_output`, `write_process_input` e `cancel_process`. Suporte futuro a MCP Tasks pode mapear esse lifecycle sem alterar o protocolo interno.
