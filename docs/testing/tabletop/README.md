# Architecture Tabletop Exercises

The first blueprint exercised the architecture on paper before implementation. The core scenarios to preserve for Blueprint v2 are:

- bounded filesystem read/write;
- long-running `mvn test` without holding one request open;
- detached application process lifecycle;
- offline device behavior;
- device reconnect without duplicate execution;
- dangerous-command approval/denial;
- prompt injection from repository content;
- concurrent clients on one workspace;
- very large command output;
- future GUI/screenshot action safety;
- signed agent update and rollback;
- hosted control-plane outage.

Each scenario should become an executable integration or chaos test when the relevant subsystem exists.
