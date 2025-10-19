import { describe, expect, it } from "vitest";
import hsh from "./index";

describe("hsh", () => {
    it.each([
        ["debug", "debug"],
        ["info", "info"],
        ["warn", "warn"],
        ["error", "error"],
        ["fatal", "fatal"],
        ["trace", "trace"],
        ["silent", "silent"],
    ])("should return '%s' for valid input '%s'", (input, expected) => {
        expect(hsh(input).get("bla")).toBe(expected);
    });
});
