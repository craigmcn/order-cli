# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn test` — run the full test suite (`c8 mocha`, with coverage instrumentation)
- `npx mocha test/cli.test.js` — run a single test file directly (faster than going through `c8`)
- `npx mocha test/cli.test.js --grep "some test name"` — run a single test by name
- `yarn coverage` — check coverage thresholds (`.nycrc` requires 100% lines/branches/statements)
- `yarn lint` / `yarn lint:fix` — ESLint (`eslint:recommended`, 2-space indent, single quotes, semicolons, trailing commas)
- `node bin/index.js [options] [--] <participants...>` — run the CLI locally without installing/linking it

Node `>=18` is required (`.nvmrc` pins `v20.2.0`). This is a `"type": "module"` package — all files use ESM `import`/`export`.

## Architecture

This is a yargs-based CLI (`speaking-order-cli`, command name `order`) that shuffles a list of names into a speaking order and optionally copies the result to the clipboard.

**Entry point**: [bin/index.js](bin/index.js) builds the yargs instance, registers the default command (`cli.js`) plus subcommands (`init`, `set`, `rm`, `show`), and loads persisted config via `Configuration.readConfiguration()` as yargs defaults (`y.config(config)`) before parsing argv.

**Default command flow** ([lib/cli.js](lib/cli.js)): merges CLI args with options, resolves participants either from positional args or from a saved `--group`, shuffles them (`lib/shuffle.js`, Fisher-Yates), joins them into a sentence (`lib/punctuatedList.js`), optionally writes the result to the clipboard (`clipboardy`), and prints with ANSI colors (`lib/colors.js`). If `--save` is passed, the resolved options + participants are persisted as a "group" via `lib/save.js`.

**Configuration system**: a per-user config file (`~/.orderrc.json` or `~/.orderrc.yaml`) stores defaults and named "groups" (saved participant lists + their option overrides). The directory it's read from defaults to `os.homedir()` but can be overridden with the `ORDER_CONFIG_DIR` env var — this is how the test suite isolates config reads/writes to a temp dir instead of touching the real home directory (see Testing below).
- [lib/configuration.js](lib/configuration.js) — locates, reads, parses, and writes the config file; format (json/yaml) is inferred from the file extension found in the config directory. `configurationFile()`/`readConfiguration()`/`writeConfiguration()` are called fresh inside each subcommand's `handler()` (not at module import time) so config state isn't frozen at process start.
- [lib/init.js](lib/init.js) — `order init [--format]` subcommand; creates the config file from `DEFAULT_CONFIG` if one doesn't already exist.
- [lib/set.js](lib/set.js) / [lib/rm.js](lib/rm.js) — `order set [-g/--group=<index>] <key> [value..]` / `order rm [-g/--group=<index>] <key> [index]` subcommands; mutate top-level config keys or a specific group's keys, using `validKeys` (derived from `lib/options.js`) to validate keys and coerce types.
- [lib/show.js](lib/show.js) — `order show [-g/--group=<index>]` subcommand; pretty-prints the config or a single group via `lib/utils.js`'s `formatObject`/`formatValue`.
- [lib/save.js](lib/save.js) — invoked from the default command when `--save` is set; upserts a "group" (matched by its sorted participant list) into `config.groups`.

**yargs command-string gotcha**: don't add bracketed flag hints like `[-g|--group=index]` into a subcommand's `command` string to "document" an option that's already declared in `builder` — yargs parses every `<...>`/`[...]` token in the command string as a real positional argument slot. A bogus bracket placed before a real `<key>`/`[value..]`/`[index]` positional silently steals the next CLI token, corrupting everything after it (this previously broke `order set <key> <value>` and `order rm <key> <index>` in real usage, even though direct unit tests of `handler()` never caught it since they bypass yargs parsing entirely). Flags defined in `builder` show up in `--help` automatically — no need to repeat them in the command string.

**Shared option definitions** ([lib/options.js](lib/options.js)) define the user-facing flags (`prefix`, `separators`, `oxfordComma`, `clipboard`, `colors`) once and derive `validKeys` (a flag/alias → `{type, parent}` map) used by `set`/`rm` to validate and resolve aliases back to canonical keys.

**Colors** ([lib/colors.js](lib/colors.js)): ANSI color helpers (`green`, `red`, `white`, `yellow`, `blue`) plus a `color(str, colorName, enabled)` dispatcher used throughout for conditional colorized output (most output respects a `colors`/`clr` flag so it can be disabled with `--no-colors`).

**Constants** ([lib/constants.js](lib/constants.js)) centralize default argv values (`DEFAULT_ARGV`), default persisted config (`DEFAULT_CONFIG`), and user-facing message strings.

**Testing config-touching code**: tests for `configuration.js`/`init.js`/`set.js`/`rm.js`/`show.js`/`save.js` set `process.env.ORDER_CONFIG_DIR` to a fresh `fs.mkdtempSync` temp dir in `beforeEach` (and clean it up in `afterEach`), then call each module's exported `handler()`/`save()` directly and assert against real file contents plus `test-console`'s `stdout.inspectSync`/`stderr.inspectSync`. There's no fs-mocking library in this repo by design — real temp-dir I/O sidesteps an ESM live-binding gotcha where spying on the `configuration.js` default-export object doesn't intercept its named-export functions when they're imported and called directly elsewhere (as every consumer here does).

**Cross-platform path gotcha**: always build config file paths with `path.join()`, never `` `${dir}/${name}` `` string concatenation — CI's `windows-latest` matrix legs caught this for real. `fs.mkdtempSync`/`path.join` produce backslash-separated paths on Windows, so concatenating with a literal `/` (as `configurationFile()`, `writeConfiguration()`, and `init.js` originally did) produces a mixed-separator path that doesn't match test assertions built with `path.join`, even though Windows' `fs` APIs happily accept the mixed path at the OS level. The CI matrix (`.github/workflows/tests.yml`, currently `node-version: [18.x, 20.x, 22.x]` × `[macos-latest, ubuntu-latest, windows-latest]`) is the only thing that exercises this — local macOS/Linux dev will never reproduce it.

## Changes vs. the published npm package (0.4.2)

The last npm release is `speaking-order-cli@0.4.2` (Jul 2023). `main` and this branch have since accumulated changes that haven't been published yet. Worth knowing before cutting the next release:

**Breaking:**
- `engines.node` bumped from `>=16.0.0` to `>=18.0.0` — breaks anyone still on Node 16/17.
- Single custom separator behavior changed (already on `main`, predates this branch, from the `joinAnd` → `punctuatedList` rename): `order -s ";" Alice Bob Charlie` used to produce `"Bob; Charlie and Alice"` (falls back to `"and"` for the final join when only one separator is given); now produces `"Bob; Charlie; Alice"` (reuses the same separator everywhere). Came from `lib/cli.js`'s call site changing `lastSeparator: argv.s[1]` (`undefined` → triggers `punctuatedList`'s own `'and'` default) to `lastSeparator: separators[1] || separators[0]` (explicitly suppresses that default). Worth a deliberate decision (keep vs. revert) before release, since it's currently just an unannounced side effect of a refactor.

**Not breaking, but notable:**
- The old self-imposed 16-participant cap (`MAX_PARTICIPANTS`) is gone — strictly more permissive.
- New `init`/`set`/`rm`/`show` subcommands and `--group`/`-g`/`--save` flags on the default command are purely additive.
- `lib/cli.js`'s internal contract changed (used to return `{message, error}` for `bin/index.js` to print; now writes to stdout/stderr directly and returns nothing) — only matters for anyone importing `lib/cli.js` directly as a library, which isn't a documented/supported use case.
- A stray `os` npm dependency (a userland package, not the Node builtin) was in `package.json` — removed; `import os from 'os'` always resolves to Node's core builtin regardless, so it was dead weight.
- `package.json`'s `bin` field has only `order`, not `order` + `speaking-order-cli` (the published 0.4.2 and a few commits on `main` register both). Confirmed with @craigmcn that adding the second alias was itself the mistake — `order` is the only intended command name, nothing to restore.

## Open items

- `package.json`'s `engines` field should be bumped to the current Node and Yarn LTS versions (currently `node >=18.0.0` and a Yarn Classic `>=1.22.0`/`packageManager: yarn@1.22.19` pin) — revisit alongside the breaking-changes decisions above before the next release.
