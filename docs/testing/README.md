# Validation Strategy

No production implementation exists yet. This directory records how architecture assumptions will be validated when implementation starts.

Expected layers:

- unit/property tests for protocol, policy and paths;
- integration tests for hosted control plane and simulated agents;
- cross-platform agent tests on Windows/macOS/Linux;
- security/adversarial tests;
- reconnect/chaos tests;
- load tests for device presence and process output;
- agent/tool evaluations for different AI clients;
- a Java/Spring Boot golden workflow as a representative software-engineering canary.
