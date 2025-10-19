import {logLevelSchema, type LogLevelMap, type LogLevel} from "./logLevelSchema";

/**
 * This function takes a string and validates it against the logLevelSchema.
 * If the string is valid, it returns the corresponding log level.
 * If the string is invalid, it defaults to "warn".
 * @param hshString
 * @returns An object with a get method to retrieve log levels by key
 */
const hsh = (hshString: string): LogLevelMap => {
    const map = logLevelSchema.parse(hshString);

    return {
        get: (key: string): LogLevel => map.get(key) || map.get("default") || "warn",
    };
};

export default hsh;
