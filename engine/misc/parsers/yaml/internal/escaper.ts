// Escaper encapsulates escaping rules for single
// and double-quoted YAML strings.
import {Pattern} from "@engine/misc/parsers/yaml/internal/pattern";

export class Escaper {

    // Mapping arrays for escaping a double quoted string. The backslash is
    // first to ensure proper escaping.
    static LIST_ESCAPEES =
        ['\\', '\\\\', '\\"', '"', "\x00", "\x01", "\x02", "\x03", "\x04", "\x05", "\x06", "\x07", "\x08", "\x09", "\x0a", "\x0b", "\x0c", "\x0d", "\x0e", "\x0f", "\x10", "\x11", "\x12", "\x13", "\x14", "\x15", "\x16",
            "\x17", "\x18", "\x19", "\x1a", "\x1b", "\x1c", "\x1d", "\x1e", "\x1f",
            String.fromCharCode(0x0085), String.fromCharCode(0x00A0),
            String.fromCharCode(0x2028), String.fromCharCode(0x2029)
        ];

    static LIST_ESCAPED = ['\\\\', '\\"', '\\"', '\\"', "\\0", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\a", "\\b", "\\t", "\\n", "\\v", "\\f", "\\r", "\\x0e", "\\x0f", "\\x10", "\\x11", "\\x12", "\\x13", "\\x14", "\\x15", "\\x16", "\\x17", "\\x18", "\\x19", "\\x1a", "\\e", "\\x1c", "\\x1d", "\\x1e", "\\x1f", "\\N", "\\_", "\\L", "\\P"];

    static MAPPING_ESCAPEES_TO_ESCAPED = (() => {
        let i, j, ref;
        const mapping: Record<any, any> = {};
        for (i = j = 0, ref = Escaper.LIST_ESCAPEES.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
            mapping[Escaper.LIST_ESCAPEES[i]] = Escaper.LIST_ESCAPED[i];
        }
        return mapping;
    })();

    // Characters that would cause a dumped string to require double quoting.
    static PATTERN_CHARACTERS_TO_ESCAPE = new Pattern('[\\x00-\\x1f]|\xc2\x85|\xc2\xa0|\xe2\x80\xa8|\xe2\x80\xa9');

    // Other precompiled patterns
    static PATTERN_MAPPING_ESCAPEES = new Pattern(Escaper.LIST_ESCAPEES.join('|').split('\\').join('\\\\'));

    static PATTERN_SINGLE_QUOTING = new Pattern('[\\s\'":{}[\\],&*#?]|^[-?|<>=!%@`]');


    // Determines if a JavaScript value would require double quoting in YAML.

    // @param [String]   value   A JavaScript value value

    // @return [Boolean] true    if the value would require double quotes.

    static requiresDoubleQuoting(value: string): boolean {
        return this.PATTERN_CHARACTERS_TO_ESCAPE.test(value);
    }

    // Escapes and surrounds a JavaScript value with double quotes.

    // @param [String]   value   A JavaScript value

    // @return [String]  The quoted, escaped string

    static escapeWithDoubleQuotes(value: string): string {
        const result = (this.PATTERN_MAPPING_ESCAPEES as any).replace(value, (str: string) => {
            return this.MAPPING_ESCAPEES_TO_ESCAPED[str];
        });
        return '"' + result + '"';
    }

    // Determines if a JavaScript value would require single quoting in YAML.

    // @param [String]   value   A JavaScript value

    // @return [Boolean] true if the value would require single quotes.

    static requiresSingleQuoting(value: string): boolean {
        return this.PATTERN_SINGLE_QUOTING.test(value);
    }

    // Escapes and surrounds a JavaScript value with single quotes.

    // @param [String]   value   A JavaScript value

    // @return [String]  The quoted, escaped string

    static escapeWithSingleQuotes(value: string): string {
        return "'" + value.replace(/'/g, "''") + "'";
    }

}


