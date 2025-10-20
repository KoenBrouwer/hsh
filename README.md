# hsh

Lightweight log-level mapper — because sometimes you just need a little hsh.

This package provides a tiny function that maps string input to log levels. It supports:
- A single default log level (e.g., `debug`, `info`, ...)
- A comma-separated map like `serviceA=debug,serviceB=error,default=warn`

It returns a small helper with a `get(key)` method so you can ask for the log level of a component/service and fall back to a default.


## Installation
```bash
npm install hsh
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

const levels = hsh("serviceA=debug,serviceB=error,default=warn");
levels.get("serviceA"); // "debug"
levels.get("serviceB"); // "error"
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
  - `HSH="serviceA=debug,serviceB=error,default=info" node app.js`

Notes:
- If HSH is unset or empty, choose a default (e.g., "warn") as shown above.
- Invalid values are coerced to "warn" by the validator, and missing `default` in maps also falls back to "warn".
- Keys must be alphanumeric and levels are case-insensitive.

## License
MIT
