# Contributing to hsh

Thank you for your interest in contributing! This document gives a quick project overview and the practical details you need to develop, test, and propose changes.

## Project overview
hsh is a tiny, dependency-light helper that maps a string into log levels. It supports:
- A single default log level (e.g., "debug", "info", ...)
- A comma-separated map like `svcA=debug,svcB=error,default=warn`

It returns a small helper with a `get(key)` method so you can ask for the log level of a component/service and fall back to a default. Levels are validated with zod and normalized to lowercase.

## Getting started (development)
Prerequisites:
- Node.js (LTS recommended)
- pnpm globally or via corepack

Setup:
- Enable corepack (recommended): `corepack enable`
- Install deps: `pnpm install`
- Run tests: `pnpm test` (watch mode)
- Build once: `pnpm build`

## Development workflow
- Write code in `src/` (TypeScript, ESM).
- Add/adjust tests in `src/*.test.ts` (Vitest).
- Keep changes focused and small; prefer clear, well-tested behavior over cleverness.
- Run tests frequently: `pnpm test` (watch). For CI-like run: `pnpm vitest run`.
- If adding public API or behavior, update README.md and tests.

### Code style and guidelines
- TypeScript, ESNext, ESM only.
- Validation via zod v4.
- Favor small pure functions and explicit types.
- Keep external API minimal and well tested.
- No linter is configured; follow existing style and formatting.

### Testing
- Framework: Vitest.
- Location: `src/index.test.ts`.
- Run watch mode: `pnpm test`.
- Run once (CI): `pnpm vitest run`.
- Please include tests for new features and bug fixes.

### Releasing and publishing
- Maintainers handle releases. The `prepublish` script runs tests (`vitest run`) and builds before publish.
- For local publish experiments you can use the included Verdaccio setup (see Reference section below).

### Opening a pull request
- Ensure tests pass locally.
- Update/add tests for your change.
- Update docs if behavior or API changes.
- Fill out a clear description of the change and its motivation.
- Keep PRs small and incremental when possible.

## Issue triage
- If filing a bug, include: expected vs actual, repro steps, versions, and minimal examples.
- If proposing a feature, describe the use case and constraints. PRs with tests are welcome.

---

## Project reference
- Language: TypeScript (ESNext)
- Module format: ESM
- Bundler: tsup
- Validation: zod v4
- Testing: Vitest

## Local npm registry (Verdaccio)
This repo contains a simple `docker-compose.yaml` to run a local Verdaccio registry, which can help testing publish flows locally.

Start Verdaccio:
```bash
docker compose up -d
```

Then you can configure npm/pnpm to use the local registry on `http://localhost:4873` for publishing or installing.

## Project structure
- `src/` — TypeScript source
  - `index.ts` — public entry; exports the `hsh` function
  - `logLevelSchema.ts` — zod schemas and types used by `hsh`
- `dist/` — build output (ESM + types)
- `src/index.test.ts` — Vitest tests
- `vitest.config.ts` — test configuration (verbose reporter, watch enabled)
- `tsconfig.json` — TypeScript configuration (ESNext, bundler resolution)
- `docker-compose.yaml` — optional local Verdaccio registry
- `verdaccio/` — local Verdaccio data/config directory (if used)
- `package.json` — package metadata, scripts, exports, tsup config
- `pnpm-lock.yaml`, `pnpm-workspace.yaml` — pnpm lockfile and workspace settings


## Entry points and exports
- Source entry: `src/index.ts`
- Build entry: configured via tsup (see `package.json`)
- Published exports (ESM only):
  - `import` → `./dist/index.mjs`
  - `types` → `./dist/index.d.mts`

## License
MIT
