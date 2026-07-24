# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn test` — run the full test suite (`c8 mocha`, with coverage instrumentation)
- `npx mocha test/cli.test.js` — run a single test file directly (faster than going through `c8`)
- `npx mocha test/cli.test.js --grep "some test name"` — run a single test by name
- `yarn coverage` — check coverage thresholds (`.nycrc` requires 100% lines/branches/statements)
- `yarn lint` / `yarn lint:fix` — ESLint (`eslint:recommended`, 2-space indent, single quotes, semicolons, trailing commas)
- `node bin/index.js [options] [--] <participants...>` — run the CLI locally without installing/linking it

Node `>=22` is required (`.node-version` pins `24.18.0`, the current Active LTS). This is a `"type": "module"` package — all files use ESM `import`/`export`.

## Architecture

This is a yargs-based CLI (`speaking-order-cli`, command name `order`) that shuffles a list of names into a speaking order and optionally copies the result to the clipboard.

**Entry point**: [bin/index.js](bin/index.js) builds the yargs instance, registers the default command (`cli.js`) plus subcommands (`init`, `set`, `rm`, `show`), and loads persisted config via `Configuration.readConfiguration()` as yargs defaults (`y.config(config)`) before parsing argv.

**Default command flow** ([lib/cli.js](lib/cli.js)): merges CLI args with options, resolves participants either from positional args or from a saved `--group`, shuffles them (`lib/shuffle.js`, Fisher-Yates), joins them into a sentence (`lib/punctuatedList.js`), optionally writes the result to the clipboard (`clipboardy`), and prints with ANSI colors (`lib/colors.js`). If `--save` is passed, the resolved options + participants are persisted as a "group" via `lib/save.js`.

**Configuration system**: a per-user config file (`~/.orderrc.json` or `~/.orderrc.yaml`) stores defaults and named "groups" (saved participant lists + their option overrides). The directory it's read from defaults to `os.homedir()` but can be overridden with the `ORDER_CONFIG_DIR` env var — this is how the test suite isolates config reads/writes to a temp dir instead of touching the real home directory (see Testing below).
- [lib/configuration.js](lib/configuration.js) — locates, reads, parses, and writes the config file; format (json/yaml) is inferred from the file extension found in the config directory. `configurationFile()`/`readConfiguration()`/`writeConfiguration()` are called fresh inside each subcommand's `handler()` (not at module import time) so config state isn't frozen at process start. `resolveGroup(config, index)` is the single shared lookup for `config.groups[index]` (returns `undefined` when missing or out of range) — `lib/cli.js`, `lib/set.js`, `lib/rm.js`, and `lib/show.js` all call it instead of each reimplementing their own `(config.groups || [])[...]` guard.
- [lib/init.js](lib/init.js) — `order init [--format]` subcommand; creates the config file from `DEFAULT_CONFIG` if one doesn't already exist.
- [lib/set.js](lib/set.js) / [lib/rm.js](lib/rm.js) — `order set [-g/--group=<index>] <key> [value..]` / `order rm [-g/--group=<index>] <key> [index]` subcommands; mutate top-level config keys or a specific group's keys, using `validKeys` (derived from `lib/options.js`) to validate keys and coerce types. `set.js` rejects an omitted value for any non-boolean key (`A value is required for '<key>'.`) — boolean keys may be set with no value, which is treated as `true`, since that's indistinguishable from a real boolean default at the yargs layer (a bare `order set oc` is a deliberate flag-style toggle).
- [lib/show.js](lib/show.js) — `order show [-g/--group=<index>]` subcommand; pretty-prints the config or a single group via `lib/utils.js`'s `formatObject`/`formatValue`.
- [lib/save.js](lib/save.js) — invoked from the default command when `--save` is set; upserts a "group" (matched by its sorted participant list) into `config.groups`.

**yargs command-string gotcha**: don't add bracketed flag hints like `[-g|--group=index]` into a subcommand's `command` string to "document" an option that's already declared in `builder` — yargs parses every `<...>`/`[...]` token in the command string as a real positional argument slot. A bogus bracket placed before a real `<key>`/`[value..]`/`[index]` positional silently steals the next CLI token, corrupting everything after it (this previously broke `order set <key> <value>` and `order rm <key> <index>` in real usage, even though direct unit tests of `handler()` never caught it since they bypass yargs parsing entirely). Flags defined in `builder` show up in `--help` automatically — no need to repeat them in the command string.

**Shared option definitions** ([lib/options.js](lib/options.js)) define the user-facing flags (`prefix`, `separators`, `oxfordComma`, `clipboard`, `colors`) once and derive `validKeys` (a flag/alias → `{type, parent}` map) used by `set`/`rm` to validate and resolve aliases back to canonical keys.

**Colors** ([lib/colors.js](lib/colors.js)): ANSI color helpers (`green`, `red`, `white`, `yellow`, `blue`) plus a `color(str, colorName, enabled)` dispatcher used throughout for conditional colorized output (most output respects a `colors`/`clr` flag so it can be disabled with `--no-colors`).

**Constants** ([lib/constants.js](lib/constants.js)) centralize default argv values (`DEFAULT_ARGV`), default persisted config (`DEFAULT_CONFIG`), and user-facing message strings.

**Testing config-touching code**: tests for `configuration.js`/`init.js`/`set.js`/`rm.js`/`show.js`/`save.js` set `process.env.ORDER_CONFIG_DIR` to a fresh `fs.mkdtempSync` temp dir in `beforeEach` (and clean it up in `afterEach`), then call each module's exported `handler()`/`save()` directly and assert against real file contents plus `test-console`'s `stdout.inspectSync`/`stderr.inspectSync`. There's no fs-mocking library in this repo by design — real temp-dir I/O sidesteps an ESM live-binding gotcha where spying on the `configuration.js` default-export object doesn't intercept its named-export functions when they're imported and called directly elsewhere (as every consumer here does).

**Cross-platform path gotcha**: always build config file paths with `path.join()`, never `` `${dir}/${name}` `` string concatenation — CI's `windows-latest` matrix legs caught this for real. `fs.mkdtempSync`/`path.join` produce backslash-separated paths on Windows, so concatenating with a literal `/` (as `configurationFile()`, `writeConfiguration()`, and `init.js` originally did) produces a mixed-separator path that doesn't match test assertions built with `path.join`, even though Windows' `fs` APIs happily accept the mixed path at the OS level. The CI matrix (`.github/workflows/tests.yml`, currently `node-version: [22.x, 24.x, 26.x]` × `[macos-latest, ubuntu-latest, windows-latest]`) is the only thing that exercises this — local macOS/Linux dev will never reproduce it.

## Release process

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); `[Unreleased]` accumulates entries as PRs land on `main`. The changelog edit happens **as part of the release commit** — not before, not as a follow-up cleanup PR:

1. Bump `version` in `package.json` (0.x semver here: breaking changes bump minor, not major).
2. In `CHANGELOG.md`, rename `## [Unreleased]` → `## [x.y.z] - <release date>`, then add a fresh empty `## [Unreleased]` above it.
3. Update the link references at the bottom of the file: point `[Unreleased]` at `compare/vx.y.z...HEAD`, and add a new `[x.y.z]: compare/v<prev>...vx.y.z` line.
4. Commit all three together (version bump + changelog rename + link refs) — this is what "cuts" the release.
5. `npm publish`, then tag `vx.y.z` on that commit and push the tag.

If a PR's version bump won't be published immediately (e.g. it lands on `main` but publishing happens later), it's still fine to do steps 1–3 in that PR — just make sure nothing else merges to `[Unreleased]` in the gap, or the dated entry becomes inaccurate.

## Changes vs. the published npm package

See [CHANGELOG.md](CHANGELOG.md) for the full breakdown of what's shipped in each release, including `0.6.0` (this PR).

**Decided:** the single-custom-separator behavior that shipped in `0.5.0` (`order -s ";" Alice Bob Charlie` → `"Bob; Charlie; Alice"`, reusing the one given separator everywhere) is the intended, permanent behavior — confirmed by @craigmcn. A single separator is the only separator; there's deliberately no fallback to `"and"` (or any second separator) when only one is given. Nothing to revert. README's `-s/--separators` row and examples spell this out.

## Session checkpoint (2026-06-24)

**Completed:**
- PR #8 (`init-save-config` → `main`) implements the full config/groups feature (`init`/`set`/`rm`/`show`, `--group`/`--save`) and is green on CI across all 9 matrix legs (macOS/Ubuntu/Windows × Node 18/20/22).
- Two rounds of review fixes landed, combining GitHub Copilot's automated PR review with an independent multi-angle review each round (commits `c9f5ee1`/`31e5ae2`/`b360da4`):
  - Crash fixes: `rm.js`/`save.js`/`show.js`/`cli.js` accessing `config.groups` without a fallback when a config file exists but has no `groups` array yet.
  - The Windows CI failure: `configurationFile()`/`writeConfiguration()`/`init.js` built paths with `` `${dir}/${name}` `` string concatenation instead of `path.join()`, producing mixed separators on Windows.
  - `configurationFile()` now picks `.orderrc.json`/`.orderrc.yaml` deterministically (explicit filename check) instead of an unordered directory scan that could also match `.orderrc.json.bak`-style files.
  - `rm groups 0` against a missing `groups` array no longer misreports "Index is required" (a falsy-zero bug) — `groups` removal now has its own dedicated, explicitly-validated branch.
  - `formatValue(null)` now renders `null` instead of a blank string.
  - `show -g <n>` falls back to the top-level `colors` setting when a saved group doesn't have its own.
  - `init.js` gained `--colors`/`--no-colors` support (previously had none at all); `rm.js`/`set.js` early-exit error messages now respect `--no-colors` like their success-path messages already did.
  - README: stale "Node >= 16" corrected to ">= 18"; removed unneeded `\|` escaping in the commands table.
- 132 tests passing, 100% line/branch/statement/function coverage maintained throughout.

**Next / open:**
- PR #8 has since merged and `0.5.0` has since been published to npm (2026-06-24) — see the 2026-07-24 checkpoint below for the follow-up upgrade work.
- The separator-fallback behavior question flagged here was resolved in the 2026-07-24 session — see "Changes vs. the published npm package" below.

**Key decisions made this session:**
- Confirmed with @craigmcn that the missing `speaking-order-cli` bin alias is correct as-is (adding it originally was the mistake) — not something to restore.
- Chose real temp-dir I/O over fs-mocking for all config-touching tests (see Testing section above) — sidesteps an ESM live-binding mocking gotcha that stalled an earlier draft.
- Kept a regenerated `yarn.lock` (picked up ~150 unrelated transitive-version bumps when removing the stray `os` dependency) rather than hand-trimming it back down — it's machine-generated and was already stale against `package.json`.

**Blockers:** none currently.

## Session checkpoint (2026-07-24)

**Completed** (branch `chore/node-upgrade-and-refactor`, prompted by a personal TODO to "review and upgrade order-cli"; PR #8 is confirmed merged and `0.5.0` confirmed published to npm on 2026-06-24, so this picks up from there):
- Node/tooling upgrade: `.nvmrc` renamed to `.node-version`, pinned to `24.18.0` (current Active LTS, replacing the old `v20.2.0` pin); `engines.node` bumped `>=18.0.0` → `>=22.0.0` (drops Node 18 and 20, both EOL by now); CI matrix bumped `[18.x, 20.x, 22.x]` → `[22.x, 24.x, 26.x]` so it always covers one major below and one above the pinned target (Maintenance LTS / Active LTS / newest Current); `actions/checkout` and `actions/setup-node` bumped `v3` → `v4`; README's "Node >= 18" corrected to ">= 22".
- Implemented the previously-deferred `resolveGroup(config, index)` shared helper in `lib/configuration.js` and switched `lib/cli.js`, `lib/set.js`, `lib/rm.js`, `lib/show.js` to call it instead of each reimplementing `(config.groups || [])[...]`. Added direct unit tests for it in `test/configuration.test.js`.
- Dependency bumps: `c8` 8.0.1 → 12.0.0 (major — required, the old 8.x line throws under Node 26 because of a broken CJS/ESM interop in its bundled `yargs`), plus in-range bumps for `chai`, `eslint`, `mocha`, `yaml`, `yargs`; `packageManager` pin `yarn@1.22.19` → `yarn@1.22.22`. See [CHANGELOG.md](CHANGELOG.md) for the full breakdown.
- Version bumped `0.5.0` → `0.6.0` (0.x semver convention: a breaking change bumps minor, not major — the `engines.node` floor moving to `>=22.0.0` is the breaking part).
- 135 tests passing (135 vs. the prior 132 — added 3 for `resolveGroup()`), 100% line/branch/statement/function coverage maintained, lint clean.
- Added [CHANGELOG.md](CHANGELOG.md) (Keep a Changelog format), backfilled with a `0.5.0` entry; the old "Changes vs. the published npm package" comparison prose in this file was trimmed down to point at it instead of duplicating it.
- **Resolved** the separator-fallback decision carried over from `0.5.0`: confirmed with @craigmcn that a single given separator is the only separator, permanently — no fallback to `"and"` or any second separator. README's `-s/--separators` row and examples updated to spell this out; CHANGELOG.md's `[Unreleased]` section records the decision.

**Deliberately not done this session** (scope was Node/tooling upgrade + the already-documented refactor + the changelog, not a full dependency-major sweep):
- Major version bumps for `chai` (4→6), `eslint` (8→10), `mocha` (10→11), `sinon` (15→22), `clipboardy` (3→5), `yargs` (17→18) were left in place. `eslint` in particular needs a flat-config migration (this repo still uses legacy `.eslintrc.json`) before 9/10 can land — that's a dedicated piece of work, not a drive-by bump.

**Blockers:** none currently.

## Open items

- **Dependency major-version sweep**: `chai`, `eslint`, `mocha`, `sinon`, `clipboardy`, `yargs` all have major releases available beyond what this session bumped (see the 2026-07-24 checkpoint above for current vs. latest). `eslint` 9/10 requires migrating `.eslintrc.json` to flat config first — do that as its own piece of work rather than bundling it with an unrelated change.
- **Future**: review `--help` output (top-level and per-subcommand) for consistency now that `init`/`set`/`rm`/`show` exist alongside the default command — e.g. whether `-g/--group` is described the same way everywhere it appears, whether `order --help` and `order set --help` read coherently as a set.
- Whether to revisit the `yarn` `engines` floor beyond the Classic patch bump made this session (e.g. a Yarn 4 migration) is an open question, not a decision — no strong signal either way yet.
