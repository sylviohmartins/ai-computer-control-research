# Threat Model — Working Set

**Status:** discovery, not final security specification.

Threat families already identified in the archived blueprint include:

1. account/OAuth token theft;
2. device-key compromise;
3. pairing phishing and replay;
4. session hijacking/replay;
5. malicious or over-privileged AI clients;
6. path traversal and symlink/reparse-point escapes;
7. sensitive-file access;
8. destructive filesystem operations;
9. encoded or obfuscated shell commands;
10. privilege escalation;
11. process/resource exhaustion;
12. dependency-install and supply-chain risk;
13. network exfiltration;
14. prompt injection from files, terminal output, webpages, screenshots or clipboard;
15. concurrent AI clients overwriting the same workspace;
16. duplicated execution after retries/reconnects;
17. stale approvals;
18. hosted control-plane compromise;
19. malicious auto-update;
20. secrets leaking through logs/artifacts.

Before implementation, this should be converted into a formal STRIDE-style model with assets, trust boundaries, threat owners, mitigations and test cases.
