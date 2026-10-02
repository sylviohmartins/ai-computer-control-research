# Public Tool Contracts — MVP

**Tool schema version:** `0.1`

Este documento define a superfície pública de tools do primeiro vertical slice. Os contratos estruturados ficam em `public-tools.schema.json`.

## Princípios

- nomes públicos usam `snake_case` e descrevem uma ação;
- cada operação é exposta individualmente;
- authorization no serviço e policy final no device;
- resultados não retornam secrets ou telemetria interna;
- operações longas usam handles explícitos;
- alterações de estado têm annotations conservadoras e critérios de aprovação.

## Catálogo

`list_devices`, `get_device`, `list_files`, `get_file_metadata`, `read_file`, `write_file`, `patch_file`, `search_files`, `run_command`, `start_process`, `read_process_output`, `write_process_input`, `cancel_process`, `list_managed_processes`, `get_git_status`, `get_git_diff`, `get_system_metrics`, `get_artifact`.

## Long-running work

`start_process` retorna `process_id`. O cliente usa `read_process_output`, `write_process_input` e `cancel_process`. Suporte futuro a MCP Tasks pode mapear esse lifecycle sem alterar o protocolo interno.
