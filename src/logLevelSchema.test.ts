import { describe, it, expect } from "vitest";
import { logLevelSchema } from "./logLevelSchema";

describe("Loglevel schema", () => {
    it("Sets default level if not set", () => {
        const input = "module1=debug,module2=trace";
        const logLevel = logLevelSchema.parse(input);

        expect(Object.fromEntries(logLevel)).toEqual({
            default: "warn",
            module1: "debug",
            module2: "trace",
        });
    });

    it("Doesn't override default level if set", () => {
        const input = "module1=debug,module2=trace,default=info";
        const logLevel = logLevelSchema.parse(input);

        expect(Object.fromEntries(logLevel)).toEqual({
            default: "info",
            module1: "debug",
            module2: "trace",
        });
    });

    it.each([
        ["trace", { default: "trace" }],
        ["debug", { default: "debug" }],
        ["info", { default: "info" }],
        ["warn", { default: "warn" }],
        ["error", { default: "error" }],
        ["fatal", { default: "fatal" }],
        ["silent", { default: "silent" }],
        ["TRACE", { default: "trace" }],
        ["DEBUG", { default: "debug" }],
        ["INFO", { default: "info" }],
        ["WARN", { default: "warn" }],
        ["ERROR", { default: "error" }],
        ["FATAL", { default: "fatal" }],
        ["SILENT", { default: "silent" }],
        ["bla", { default: "warn" }],
        ["BLA", { default: "warn" }],
        ["something", { default: "warn" }],
        ["SOMETHING", { default: "warn" }],
        ["bla=====sdfsdf,,,sdfjas=sdhy23", { default: "warn" }],
        ["module1=trace", { default: "warn", module1: "trace" }],
        [
            "module2=debug,module3=info",
            { default: "warn", module2: "debug", module3: "info" },
        ],
        [
            "module4=warn,module5=error,module6=fatal",
            {
                default: "warn",
                module4: "warn",
                module5: "error",
                module6: "fatal",
            },
        ],
        [
            "module7=info,module8=blablabla,module9=trace,module10=warn",
            {
                default: "warn",
                module7: "info",
                module8: "warn",
                module9: "trace",
                module10: "warn",
            },
        ],
        ["default=info,debug,trace", { default: "warn" }],
        ["default=info", { default: "info" }],
        ["default=info,default=error", { default: "error" }],
        ["default=info,default=blabla", { default: "warn" }],
        [
            "module1=info,module21= blabla",
            { default: "warn", module1: "info", module21: "warn" },
        ],
        ["module1=info,=,module21==blabla", { default: "warn" }],
        ["info,default=warn,moduleX=bla", { default: "warn" }],
        [
            "module1=debug,module2=trace",
            {
                default: "warn",
                module1: "debug",
                module2: "trace",
            },
        ],
    ])("It parses %s as %o", (input, expected) => {
        const logLevel = logLevelSchema.parse(input);

        expect(Object.fromEntries(logLevel)).toEqual(expected);
    });
});
