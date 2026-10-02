import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";

import type { Env } from "../src/env";

type Migrations = Parameters<typeof applyD1Migrations>[1];
type TestEnv = Env & { TEST_MIGRATIONS: Migrations };

const testEnv = env as unknown as TestEnv;

await applyD1Migrations(testEnv.DB, testEnv.TEST_MIGRATIONS);
