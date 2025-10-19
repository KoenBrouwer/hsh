# hsh

Lightweight log-level mapper — because sometimes you just need a little hsh.

This package provides a tiny function that maps string input to log levels. It supports:
- A single default log level (e.g., "debug", "info", ...)
- A comma-separated map like `svcA=debug,svcB=error,default=warn`

It returns a small helper with a `get(key)` method so you can ask for the log level of a component/service and fall back to a default.


## Stack
- Language: TypeScript (ESNext)
- Module format: ESM
- Bundler: tsup
- Validation: zod v4
- Testing: Vitest


## Requirements
- Node.js
- pnpm installed globally or use corepack


## Installation
```bash
pnpm install
```

If you prefer corepack (recommended), ensure it is enabled:
```bash
corepack enable
```


## Usage
Use a single level for all components:
```ts
import hsh from "hsh";

const levels = hsh("debug");
levels.get("anything"); // "debug"
```

Or provide a map string to configure per-key levels with a default:
```ts
import hsh from "hsh";

const levels = hsh("svcA=debug,svcB=error,default=warn");
levels.get("svcA"); // "debug"
levels.get("svcB"); // "error"
levels.get("other"); // "warn" (default)
```

Accepted log levels are exactly: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`.

Invalid levels are coerced to `warn` by the validator.

Notes:
- Keys in the map must be alphanumeric (as defined by the regex in source).
- Level strings are case-insensitive; they will be lowercased during parsing.


## API
- Default export: `hsh(input: string): { get(key: string): LogLevel }`
  - `input` can be a single level or a map string as shown above.
  - `get(key)` returns the configured level for `key` or the `default` level. If no default is provided, it falls back to `warn`.

Types are generated and shipped as ESM `.d.mts`.


## Scripts
From package.json:
- `pnpm test` — runs Vitest in watch mode (per `vitest.config.ts`)
- `pnpm build` — builds with tsup (ESM output to `dist/`, emits types)
- `pnpm prepublish` — runs tests in CI mode (`vitest run`) and then builds


## Running tests
Interactive/watch (default reporters are verbose):
```bash
pnpm test
```

CI/non-watch:
```bash
pnpm vitest run
```


## Build
```bash
pnpm build
```
Build artifacts:
- `dist/index.mjs` (ESM bundle)
- `dist/index.d.mts` (types)


## Environment variables
The library itself does not read environment variables. A common pattern is to pass a string from an env var into `hsh()`.

You can use the environment variable HSH and wire it in your application like this:
```ts
import hsh from "hsh";

// Read from process.env.HSH with a sensible fallback
const levels = hsh(process.env.HSH ?? "warn");

// Later in your code
levels.get("my-service"); // resolves based on HSH or falls back to "warn"
```

Examples:
- Single level for everything:
  - `HSH=debug node app.js`
- Map with per-key levels and a default:
  - `HSH="svcA=debug,svcB=error,default=info" node app.js`

Notes:
- If HSH is unset or empty, choose a default (e.g., "warn") as shown above.
- Invalid values are coerced to "warn" by the validator, and missing `default` in maps also falls back to "warn".
- Keys must be alphanumeric and levels are case-insensitive.

- TODO: Confirm adopting HSH as the conventional env var name for apps using this library.


## Local npm registry (Verdaccio)
This repo contains a simple `docker-compose.yaml` to run a local Verdaccio registry, which can help testing publish flows locally.

Start Verdaccio:
```bash
docker compose up -d
```

Then you can configure npm/pnpm to use the local registry on `http://localhost:4873` for publishing or installing.
- TODO: Add the exact `.npmrc` examples and publish steps if this workflow is adopted.


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
