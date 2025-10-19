import z from "zod/v4";

const defaultLogLevel = "warn";

/**
 * Schema definition for basic log level validation.
 *
 * This variable defines the possible log levels that are supported
 * as string literals. It ensures that only the specified log levels
 * can be used in the application where the schema is applied.
 */
const basicLogLevelSchema = z
    .literal(["trace", "debug", "info", "warn", "error", "fatal", "silent"])
    .catch("warn");

export type LogLevel = z.infer<typeof basicLogLevelSchema>;

/**
 * `looseLogLevelSchema` is a schema defined using `z.string()` from the Zod library.
 * It processes strings by converting them to lowercase using the `toLowerCase` method
 * and validates them against the `basicLogLevelSchema`.
 *
 * The purpose of this schema is to provide case-insensitive string validation
 * while reusing the constraints defined in the `basicLogLevelSchema`.
 */
const looseLogLevelSchema = z
    .string()
    .overwrite((s) => s.toLowerCase())
    .pipe(basicLogLevelSchema)
    .transform((level) => new Map([["default", level]]));

export const logLevelMapRegex = /^([a-zA-Z0-9]+=[^,]+(,[a-zA-Z0-9]+=[^,=]+)*)$/;

const logLevelMapSchema = z
    .string()
    .regex(logLevelMapRegex)
    .transform((s) => {
        const map = s.split(",").reduce((acc, part) => {
            const [key, value] = part.split("=");
            acc.set(key, basicLogLevelSchema.parse(value.toLowerCase()));
            return acc;
        }, new Map<string, LogLevel>());

        if (!map.has("default")) {
            map.set("default", defaultLogLevel);
        } else {
            const defaultLevel = map.get("default")?.toLowerCase();
            map.set("default", basicLogLevelSchema.parse(defaultLevel));
        }
        // Validate all log levels
        for (const [key, value] of map) {
            map.set(key, basicLogLevelSchema.parse(value));
        }

        return map;
    });

export const logLevelSchema = z.union([logLevelMapSchema, looseLogLevelSchema]);

export type LogLevelMap = {
	get: (key: string) => LogLevel;
};
