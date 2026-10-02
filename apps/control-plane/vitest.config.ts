import path from "node:path";

import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const migrations = await readD1Migrations(
    path.join(import.meta.dirname, "migrations"),
  );

  return {
    plugins: [
      cloudflareTest({
        wrangler: {
          configPath: "./wrangler.jsonc",
        },
        miniflare: {
          bindings: {
            TEST_MIGRATIONS: migrations,
            PAIRING_SERVER_SECRET:
              "phase3-test-secret-0123456789-abcdefghijklmnopqrstuvwxyz",
            PAIRING_VERIFICATION_URI: "https://telechir.test/pair",
          },
        },
      }),
    ],
    test: {
      setupFiles: ["./test/setup.ts"],
    },
  };
});
