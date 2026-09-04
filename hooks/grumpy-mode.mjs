#!/usr/bin/env node
// Set or report the mode.  node grumpy-mode.mjs [nag|gate|off]

import { resolveMode, setMode, MODES, configPath } from "./lib/config.mjs";

const arg = (process.argv[2] || "").trim().toLowerCase();

if (!arg) {
  const { mode, source } = resolveMode();
  console.log(`Grump mode: ${mode} (from ${source})`);
  console.log(`Change it with /grumpy nag|gate|off, or set GRUMPY_MODE for one session.`);
} else if (MODES.includes(arg)) {
  if (process.env.GRUMPY_MODE && process.env.GRUMPY_MODE.toLowerCase() !== arg) {
    console.log(`GRUMPY_MODE=${process.env.GRUMPY_MODE} is set in the environment and wins over the config file. Unset it or restart without it.`);
  }
  const { mode, previous } = setMode(arg);
  console.log(`Grump mode: ${mode} (was ${previous}); saved to ${configPath()}`);
} else {
  console.log(`Unknown mode "${arg}". Use one of: ${MODES.join(", ")}.`);
  process.exitCode = 1;
}
