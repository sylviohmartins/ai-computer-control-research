# Naming Discovery — Stage 2: Constructed Distinctive Names

**Data:** 2026-10-01  
**Gate:** `NAME_CONDITIONAL`  
**Primary recommendation:** **Telechir**  
**Implementação de produto:** não iniciada

## 1. Resumo executivo

Esta etapa foi executada após duas rodadas anteriores mostrarem que palavras reais curtas e metaforicamente boas estão fortemente saturadas em AI/dev tooling. O objetivo foi testar uma hipótese diferente: construir centenas de nomes distintivos com fonotática razoável a partir dos melhores territórios semânticos, fazer screening de colisão cedo e verificar se algum deles supera os melhores achados autênticos.

Foram materializados **560 candidatos construídos/normalizados** nesta etapa, cobrindo 13 territórios. O funil preservou dez nomes para análise comparativa e cinco finalistas.

A conclusão não é escolher um nome sintético apenas porque ele parece livre. **Nenhum nome construído superou Telechir em combinação de autenticidade, história, fit com o produto e baixa colisão comercial preliminar.** Por isso Telechir volta a ser a recomendação primária, agora com evidência adicional.

O status permanece `NAME_CONDITIONAL`, e não `NAME_READY`, porque domínio e trademark ainda exigem consultas autoritativas fora das evidências indexadas disponíveis nesta sessão.

## 2. Por que Telechir voltou ao topo

Telechir não é uma palavra inventada. A base terminológica TERMIUM Plus do Governo do Canadá registra `telechir` como termo correto e o define como *handlike remote manipulator*. Collins o define como um braço robótico controlado remotamente. Fontes técnicas históricas explicam a formação em grego para “distant” + “hand”.

Isso produz uma narrativa de marca que não precisa ser inventada retroativamente:

> **A IA pensa; Telechir é a mão remota, autorizada e auditável que transforma intenção em ação sobre uma máquina.**

A semântica continua válida se o produto crescer de filesystem/terminal para browser, GUI, sandboxes, servidores e outros execution environments.

## 3. Personalidade de marca

- capacidade sem agressividade;
- confiança sem tom enterprise genérico;
- inteligência sem “AI” no nome;
- movimento/ação sem virar “remote desktop”;
- técnica, minimalista e com história autêntica.

## 4. Estratégia desta etapa

1. preservar territórios vencedores das rodadas anteriores;
2. extrair raízes e fonemas, não copiar palavras literais;
3. gerar 500+ candidatos;
4. bloquear dependência de `AI`, `Agent`, `Remote`, `Desktop`, `MCP`, `Bridge`, `Port`;
5. fazer screening de GitHub/web antes de apego criativo;
6. comparar finalistas com Telechir;
7. não promover candidato sintético inferior só por aparentar menor colisão.

## 5. Territórios

Os territórios de maior rendimento foram:
- teleoperation / remote hand;
- nervous-system / efferent signal;
- mechanical linkage;
- touch / haptics;
- praxis / action;
- reach / grasp;
- guidance / navigation;
- channels / conduits;
- messenger / delegation;
- security / guard;
- weave / coordination.

## 6. Funil

- universo construído registrado: **560**
- shortlist comparativa: **10**
- finalistas: **5**
- recomendação primária: **Telechir**
- gate: **NAME_CONDITIONAL**

## 7. Top 10

| # | Nome | Score criativo | Status | Observação |
|---:|---|---:|---|---|
| 1 | **Telechir** | 94 | NAME_CONDITIONAL | Termo histórico real para manipulador remoto semelhante a uma mão; melhor fit semântico e storytelling. |
| 2 | **Clevren** | 87 | FINALIST | Curto, forte em PT/EN/ES e ligado a linkage/motion. |
| 3 | **Ferenis** | 85 | FINALIST | Som natural e narrativa de condução/transmissão. |
| 4 | **Kheric** | 82 | FINALIST | Raiz de 'kheir/cheir' preserva a metáfora de mão. |
| 5 | **Tactren** | 81 | FINALIST | Evoca tato, ação e transferência; oralidade razoável. |
| 6 | **Rivrel** | 78 | BACKUP | Compacto e mecânico. |
| 7 | **Ferenel** | 77 | BACKUP | Pronúncia previsível. |
| 8 | **Wevren** | 75 | BACKUP | Remete a weave/coordenação. |
| 9 | **Helven** | 73 | BACKUP | Boa oralidade. |
| 10 | **Telchir** | 72 | BACKUP | Mais curto que Telechir e baixa colisão preliminar. |

Os scores são internos ao discovery e medem fit/brandabilidade, não probabilidade jurídica de registro.

## 8. Finalistas

### Telechir — recomendação primária

**Pronúncia de referência:** inglês `TEL-i-keer` / `TEL-i-kir`; em PT-BR a tendência natural é `te-le-KIR`/ `TÉ-le-quir`. O radio test não é perfeito e precisa de validação com usuários.

**Origem:** vocabulário histórico de robótica/teleoperação.

**Brand idea:** mão remota que estende a capacidade de agir.

**One-line:** controle seguro de computadores para agentes de IA.

**Tagline de trabalho:** *Give AI a secure hand on your machines.*

**Naming system:** `telechir`, `telechir-agent`, `telechir-mcp`, `telechir-sdk`, `@telechir/core`.

**Risco:** é um termo de dicionário/técnico, portanto pode ter uso histórico por terceiros; disponibilidade jurídica/domínio não foi provada.

### Clevren

**Ideia:** ligação mecânica e transmissão controlada de movimento.  
**Força:** curto e oral.  
**Risco:** narrativa menos autêntica que Telechir e precisa de clearance completo.

### Ferenis

**Ideia:** carregar/transmitir intenção até um executor.  
**Força:** sonoridade relativamente natural e baixa colisão preliminar.  
**Risco:** significado depende de construção editorial.

### Kheric

**Ideia:** preservar a raiz grega de “mão”.  
**Força:** conecta-se ao mesmo território conceitual de Telechir.  
**Risco:** ocorre como sobrenome/topônimo e possui spellability inferior.

### Tactren

**Ideia:** tato + transferência/ação.  
**Força:** lembra capacidade física sem dizer “remote”.  
**Risco:** soa mais claramente construído.

## 9. Screening de colisão

A etapa confirmou diversas eliminações importantes: Navren, Kivren, Relven, Tenvik, Vecten, Praxum, Praxel, Praxir, Prensil, Eferon, Eferen, Eferis, Efference, Efferent, Keryx, Kheiron, Telefactor, Eftor, Motriv, Prenel, Torven, Axelis, Relen, Tensel, Sigrel, Navrel, Vectel e Synor apresentaram produtos, empresas, packages ou projetos suficientemente próximos para não merecer investimento adicional.

Para **Telechir**, as pesquisas atuais encontraram principalmente o termo técnico histórico e referências educacionais/robóticas; não apareceu uma plataforma contemporânea de AI/dev tooling com colisão direta material.

## 10. GitHub/packages

- busca exata de repositório não revelou um produto concorrente contemporâneo relevante chamado Telechir na triagem realizada;
- Telchir, Clevren, Ferenis e Tactren também tiveram footprint de GitHub baixo no screening;
- ausência em resultados indexados **não prova disponibilidade de namespace**;
- npm, PyPI e crates.io devem ser consultados diretamente no momento de reservar o nome.

## 11. Domínios

Buscas indexadas por `telechir.com`, `telechir.dev`, `telechir.ai` e `telechir.io` não retornaram footprint material nesta sessão. Isso **não equivale a disponibilidade**.

Gate pendente: consulta em registrador/RDAP/WHOIS em tempo real.

## 12. Trademark preliminary screening

Buscas indexadas gerais e em domínios oficiais não revelaram red flag exata óbvia para Telechir nesta sessão.

Isso **não é trademark clearance**. Antes de `NAME_READY`, executar:
- INPI: exata + fonética/gráfica em classes relevantes;
- USPTO/EUIPO/WIPO se houver lançamento internacional;
- análise jurídica se o projeto caminhar para uso comercial.

## 13. PT-BR / EN / ES

**Telechir**
- PT-BR: diferente, porém pronunciável; exige decidir a pronúncia de marca.
- EN: existe pronúncia de dicionário e tradição técnica.
- ES: grafia legível, com possível variação de “ch”.
- vantagem: palavra real e história defensável;
- desvantagem: radio test não é tão instantâneo quanto Cursor/Warp.

**Clevren/Ferenis/Tactren**
- têm spellability razoável;
- são mais neutros;
- perdem a autenticidade que motivou o novo padrão de qualidade.

## 14. SEO

A marca não deve carregar keywords. Descriptor recomendado:

> **Telechir — Secure computer control for AI agents**

Páginas futuras podem capturar:
- AI computer control;
- ChatGPT computer control;
- AI remote desktop;
- MCP terminal;
- MCP filesystem;
- computer-use agent.

## 15. Brand extension test

A marca funciona como:
- Telechir Agent
- Telechir CLI
- Telechir Cloud
- Telechir MCP
- Telechir Runtime
- Telechir SDK
- Telechir Enterprise

## 16. Gate

### `NAME_CONDITIONAL`

Telechir atingiu o nível de qualidade de marca necessário para ser a recomendação primária do projeto, mas ainda não pode ser tratado como juridicamente/operacionalmente reservado.

### Para virar `NAME_READY`

1. domínio em registrador autoritativo;
2. packages em registries diretamente;
3. handles sociais relevantes;
4. busca direta INPI;
5. USPTO/EUIPO/WIPO conforme escopo;
6. teste oral rápido PT-BR/EN/ES.

## 17. Decisão para o repositório

**Não renomear ainda** `ai-computer-control-research`.

A marca pode ser usada internamente como **primary candidate: Telechir**, mas o rename deve ocorrer somente após `NAME_READY`.

## 18. Fontes-chave

- TERMIUM Plus, Governo do Canadá — https://www.btb.termiumplus.gc.ca/
- Collins English Dictionary — https://www.collinsdictionary.com/dictionary/english/telechir
- histórico técnico de telechir/telechirics consultado em fontes acadêmicas e de engenharia.
- GitHub search e web search datados de 2026-10-01 para collision screening.

## 19. Resultado explícito

1. Personalidade: capacidade + confiança + inteligência + movimento.
2. Territórios mais fortes: remote hand/teleoperation, efferent signal, linkage, haptics, action.
3. Saturados: Agent/Bridge/Remote/Port/Machine/AI/MCP e grande parte das palavras curtas literais.
4. Top 10: documentado acima.
5. Finalistas: Telechir, Clevren, Ferenis, Kheric, Tactren.
6. Primary recommendation: **Telechir**.
7. Estado: **NAME_CONDITIONAL**.
8. Repositório pode continuar sendo criado/versionado com nome descritivo; **não renomear para Telechir ainda**.
