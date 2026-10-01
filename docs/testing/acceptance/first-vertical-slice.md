# First Vertical Slice — Acceptance Criteria

**Status:** proposed; applies only after the implementation gate is opened.

A first meaningful implementation should demonstrate on a non-sensitive test machine that:

1. the agent runs without requiring administrator/root for normal operation;
2. a device can be paired with one-time verification;
3. the machine does not require an inbound public port;
4. an authorized AI/MCP client can list the device;
5. filesystem operations cannot escape configured roots;
6. a permitted file can be read;
7. a permitted write/patch follows local policy;
8. a safe process can be started and identified by a stable handle;
9. process output can be read after the original request ends;
10. a process can be cancelled;
11. `git status` and `git diff` can be retrieved;
12. every remote action produces an audit event;
13. device revocation blocks future remote actions/reconnect;
14. a dangerous command is denied or requires the configured local approval path;
15. reconnect/retry does not duplicate an acknowledged command.
