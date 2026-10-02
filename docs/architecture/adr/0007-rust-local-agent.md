# ADR-0007: Implementar o Core do Local Agent em Rust

- **Status:** Accepted
- **Data:** 2026-10-02

## Contexto

O local agent é a principal fronteira de segurança do produto. Ele precisa funcionar em Windows, macOS e Linux, operar filesystem/processos, manter canal assíncrono, usar keystores nativos, ter footprint baixo e ser distribuível como binário independente.

## Opções consideradas

- Rust;
- Go;
- TypeScript/Node.js;
- .NET;
- stack híbrida.

## Decisão

Usar **Rust** para o core do Telechir Agent.

Uma UI/tray futura pode usar Tauri ou frontend separado sem transformar a UI em runtime authority.

## Razões

- memory safety sem garbage collector obrigatório;
- controle fino de processos e integração nativa;
- bom suporte async/networking;
- single-binary deployment;
- boa adequação a software que aplica policy e lida com dados locais sensíveis.

## Trade-offs

- curva de aprendizado e tempos de compilação maiores;
- diferenças de Win32/macOS/Linux ainda exigem adapters;
- algumas APIs de accessibility/GUI poderão demandar FFI e módulos específicos;
- velocidade de prototipação pode ser menor do que Node.

## Invariantes

A escolha de Rust não autoriza unsafe sem revisão.

Módulos de:
- path canonicalization;
- process tree;
- keystore;
- updater;
- protocol framing

devem possuir testes por plataforma e interfaces estreitas.

## Reversibilidade

Média. O wire protocol e tool contracts são cross-language para permitir reimplementação futura sem quebrar clientes.
