# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(pre-1.0, so breaking changes bump the minor version, not the major).

This changelog starts at 0.5.0 — versions 0.1.0 through 0.4.2 predate this file and
were not tracked in this format; see the [release tags](https://github.com/craigmcn/order-cli/tags)
and their commit history for that history.

## [Unreleased]

## [0.6.0] - 2026-07-24

### Changed
- **Breaking:** `engines.node` bumped from `>=18.0.0` to `>=22.0.0` — drops Node 18 (EOL Apr 2025) and Node 20 (EOL Apr 2026).
- Local dev Node version pin renamed `.nvmrc` → `.node-version`, now pinning `24.18.0` (current Active LTS).
- CI matrix now tests `22.x`/`24.x`/`26.x` (Maintenance LTS / Active LTS / newest Current) instead of `18.x`/`20.x`/`22.x`.
- `packageManager` pin bumped `yarn@1.22.19` → `yarn@1.22.22`.
- Dev dependency bumps: `c8` 8.0.1 → 12.0.0, plus in-range patch/minor bumps for `chai`, `eslint`, `mocha`, `yaml`, `yargs`.
- `actions/checkout` and `actions/setup-node` bumped `v3` → `v4` in CI.
- Confirmed (no behavior change): the single-custom-separator behavior introduced in `0.5.0` — when only one separator is given, it's the only separator used, with no fallback to `"and"` — is the intended, permanent behavior, not an unannounced side effect. This closes out the decision `0.5.0` left open.
- Added a shared `resolveGroup(config, index)` helper in `lib/configuration.js`; `cli.js`/`set.js`/`rm.js`/`show.js` now use it instead of each reimplementing `(config.groups || [])[...]`.

## [0.5.0] - 2026-06-24

### Added
- `order init [--format]` subcommand — creates a config file (`~/.orderrc.json` or `.yaml`) from a set of defaults if one doesn't already exist.
- `order set [-g/--group=<index>] <key> [value..]` subcommand — sets a top-level config value, or a key on a specific saved group.
- `order rm [-g/--group=<index>] <key> [index]` subcommand — removes a top-level config value, a key from a group, or an entire saved group.
- `order show [-g/--group=<index>]` subcommand — pretty-prints the full config or a single saved group.
- `--group`/`-g` and `--save` flags on the default command, for running against and persisting named "groups" (saved participant lists + option overrides).

### Changed
- **Breaking:** `engines.node` bumped from `>=16.0.0` to `>=18.0.0`.
- **Breaking:** single custom separator behavior changed — `order -s ";" Alice Bob Charlie` used to fall back to `"and"` for the final join (`"Bob; Charlie and Alice"`); it now reuses the same separator everywhere (`"Bob; Charlie; Alice"`).

### Removed
- The self-imposed 16-participant cap (`MAX_PARTICIPANTS`) — the CLI now accepts any number of participants.
- A stray `os` npm dependency that shadowed nothing useful (`import os from 'os'` always resolved to Node's core builtin regardless).
- The `speaking-order-cli` bin alias — `order` is now the only registered command name.

### Fixed
- `rm`/`save`/`show`/the default command no longer crash when a config file exists but has no `groups` array yet.
- Config file paths are now built with `path.join()` instead of string concatenation, fixing mixed-separator paths on Windows.
- `configurationFile()` now deterministically prefers `.orderrc.json` over `.orderrc.yaml`, and ignores unrelated files like a `.orderrc.json.bak`.
- `rm groups 0` no longer misreports "Index is required" (a falsy-zero bug).
- `formatValue(null)` now renders `null` instead of a blank string.
- `show -g <n>` now falls back to the top-level `colors` setting when a saved group doesn't have its own.
- `init` gained `--colors`/`--no-colors` support; `rm`/`set` error messages now respect `--no-colors` consistently with their success-path messages.

[Unreleased]: https://github.com/craigmcn/order-cli/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/craigmcn/order-cli/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/craigmcn/order-cli/compare/v0.4.2...v0.5.0
