import {Pattern} from "@engine/misc/parsers/yaml/internal/pattern";


export class Utils {

    static REGEX_LEFT_TRIM_BY_CHAR: Record<any, any> = {};

    static REGEX_RIGHT_TRIM_BY_CHAR: Record<any, any> = {};

    static REGEX_SPACES = /\s+/g;

    static REGEX_DIGITS = /^\d+$/;

    static REGEX_OCTAL = /[^0-7]/gi;

    static REGEX_HEXADECIMAL = /[^a-f0-9]/gi;

    // Precompiled date pattern
    static PATTERN_DATE = new Pattern('^' + '(?<year>[0-9][0-9][0-9][0-9])' + '-(?<month>[0-9][0-9]?)' + '-(?<day>[0-9][0-9]?)' + '(?:(?:[Tt]|[ \t]+)' + '(?<hour>[0-9][0-9]?)' + ':(?<minute>[0-9][0-9])' + ':(?<second>[0-9][0-9])' + '(?:.(?<fraction>[0-9]*))?' + '(?:[ \t]*(?<tz>Z|(?<tz_sign>[-+])(?<tz_hour>[0-9][0-9]?)' + '(?::(?<tz_minute>[0-9][0-9]))?))?)?' + '$', 'i');

    // Local timezone offset in ms
    static LOCAL_TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;


    // Trims the given string on both sides

    // @param [String] str The string to trim
    // @param [String] _char The character to use for trimming (default: '\\s')

    // @return [String] A trimmed string

    static trim(str: string, _char = '\\s'): string {
        let regexLeft, regexRight;
        regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
        if (regexLeft == null) {
            this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp('^' + _char + '' + _char + '*');
        }
        regexLeft.lastIndex = 0;
        regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
        if (regexRight == null) {
            this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + '' + _char + '*$');
        }
        regexRight.lastIndex = 0;
        return str.replace(regexLeft, '').replace(regexRight, '');
    }

    // Trims the given string on the left side

    // @param [String] str The string to trim
    // @param [String] _char The character to use for trimming (default: '\\s')

    // @return [String] A trimmed string

    static ltrim(str: string, _char = '\\s'): string {
        let regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
        if (regexLeft == null) {
            this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp('^' + _char + '' + _char + '*');
        }
        regexLeft.lastIndex = 0;
        return str.replace(regexLeft, '');
    }

    // Trims the given string on the right side

    // @param [String] str The string to trim
    // @param [String] _char The character to use for trimming (default: '\\s')

    // @return [String] A trimmed string

    static rtrim(str: string, _char = '\\s'): string {
        let regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
        if (regexRight == null) {
            this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + '' + _char + '*$');
        }
        regexRight.lastIndex = 0;
        return str.replace(regexRight, '');
    }

    // Checks if the given value is empty (null, undefined, empty string, string '0', empty Array, empty Object)

    // @param [Object] value The value to check

    // @return [Boolean] true if the value is empty

    static isEmpty(value: any) {
        return !value || value === '' || value === '0' || (value instanceof Array && value.length === 0) || this.isEmptyObject(value);
    }

    // Checks if the given value is an empty object

    // @param [Object] value The value to check

    // @return [Boolean] true if the value is empty and is an object

    static isEmptyObject(value: any) {
        return value instanceof Object && ((function () {
            const results: any[] = [];
            for (const k in value) {
                // eslint-disable-next-line
                if (!value.hasOwnProperty(k)) continue;
                results.push(k);
            }
            return results;
        })()).length === 0;
    }

    // Counts the number of occurences of subString inside string

    // @param [String] string The string where to count occurences
    // @param [String] subString The subString to count
    // @param [Integer] start The start index
    // @param [Integer] length The string length until where to count

    // @return [Integer] The number of occurences

    static subStrCount(string: string, subString: string, start: number = null!, length: number = null!) {
        let c, i, j, ref;
        c = 0;
        string = '' + string;
        subString = '' + subString;
        if (start != null) {
            string = string.slice(start);
        }
        if (length != null) {
            string = string.slice(0, length);
        }
        const len = string.length;
        const sublen = subString.length;
        for (i = j = 0, ref = len; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
            if (subString === string.slice(i, sublen)) {
                c++;
                i += sublen - 1;
            }
        }
        return c;
    }

    // Returns true if input is only composed of digits

    // @param [Object] input The value to test

    // @return [Boolean] true if input is only composed of digits

    static isDigits(input: string): boolean {
        this.REGEX_DIGITS.lastIndex = 0;
        return this.REGEX_DIGITS.test(input);
    }

    // Decode octal value

    // @param [String] input The value to decode

    // @return [Integer] The decoded value

    static octDec(input: string): number {
        this.REGEX_OCTAL.lastIndex = 0;
        return parseInt((input + '').replace(this.REGEX_OCTAL, ''), 8);
    }

    // Decode hexadecimal value

    // @param [String] input The value to decode

    // @return [Integer] The decoded value

    static hexDec(input: string): number {
        this.REGEX_HEXADECIMAL.lastIndex = 0;
        input = this.trim(input);
        if ((input + '').slice(0, 2) === '0x') {
            input = (input + '').slice(2);
        }
        return parseInt((input + '').replace(this.REGEX_HEXADECIMAL, ''), 16);
    }

    // Get the UTF-8 character for the given code point.

    // @param [Integer] c The unicode code point

    // @return [String] The corresponding UTF-8 character

    static utf8chr(c: number): string {
        const ch = String.fromCharCode;
        if (0x80 > (c %= 0x200000)) {
            return ch(c);
        }
        if (0x800 > c) {
            return ch(0xC0 | c >> 6) + ch(0x80 | c & 0x3F);
        }
        if (0x10000 > c) {
            return ch(0xE0 | c >> 12) + ch(0x80 | c >> 6 & 0x3F) + ch(0x80 | c & 0x3F);
        }
        return ch(0xF0 | c >> 18) + ch(0x80 | c >> 12 & 0x3F) + ch(0x80 | c >> 6 & 0x3F) + ch(0x80 | c & 0x3F);
    }

    // Returns the boolean value equivalent to the given input

    // @param [String|Object]    input       The input value
    // @param [Boolean]          strict      If set to false, accept 'yes' and 'no' as boolean values

    // @return [Boolean]         the boolean value

    static parseBoolean(input: any, strict = true): boolean {
        let lowerInput;
        if (typeof input === 'string') {
            lowerInput = input.toLowerCase();
            if (!strict) {
                if (lowerInput === 'no') {
                    return false;
                }
            }
            if (lowerInput === '0') {
                return false;
            }
            if (lowerInput === 'false') {
                return false;
            }
            return lowerInput !== '';

        }
        return !!input;
    }

    // Returns true if input is numeric

    // @param [Object] input The value to test

    // @return [Boolean] true if input is numeric

    static isNumeric(input: any): boolean {
        this.REGEX_SPACES.lastIndex = 0;
        return typeof input === 'number' || typeof input === 'string' && !isNaN(input as unknown as number) && input.replace(this.REGEX_SPACES, '') !== '';
    }

    // Returns a parsed date from the given string

    // @param [String] str The date string to parse

    // @return [Date] The parsed date or null if parsing failed

    static stringToDate(str: string): Date {
        let date, fraction, tz_hour, tz_minute, tz_offset;
        if (!(str != null ? str.length : void 0)) {
            return null!;
        }
        // Perform regular expression pattern
        const info = this.PATTERN_DATE.exec(str);
        if (!info) {
            return null!;
        }
        // Extract year, month, day
        const year = parseInt(info.year, 10);
        const month = parseInt(info.month, 10) - 1; // In javascript, january is 0, february 1, etc...
        const day = parseInt(info.day, 10);
        // If no hour is given, return a date with day precision
        if (info.hour == null) {
            date = new Date(Date.UTC(year, month, day));
            return date;
        }
        // Extract hour, minute, second
        const hour = parseInt(info.hour, 10);
        const minute = parseInt(info.minute, 10);
        const second = parseInt(info.second, 10);
        // Extract fraction, if given
        if (info.fraction != null) {
            fraction = info.fraction.slice(0, 3);
            while (fraction.length < 3) {
                fraction += '0';
            }
            fraction = parseInt(fraction, 10);
        } else {
            fraction = 0;
        }
        // Compute timezone offset if given
        if (info.tz != null) {
            tz_hour = parseInt(info.tz_hour, 10);
            if (info.tz_minute != null) {
                tz_minute = parseInt(info.tz_minute, 10);
            } else {
                tz_minute = 0;
            }
            // Compute timezone delta in ms
            tz_offset = (tz_hour * 60 + tz_minute) * 60000;
            if ('-' === info.tz_sign) {
                tz_offset *= -1;
            }
        }
        // Compute date
        date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
        if (tz_offset) {
            date.setTime(date.getTime() - tz_offset);
        }
        return date;
    }

    // Repeats the given string a number of times

    // @param [String]   str     The string to repeat
    // @param [Integer]  number  The number of times to repeat the string

    // @return [String]  The repeated string

    static strRepeat(str: string, number: number): string {
        let i, res;
        res = '';
        i = 0;
        while (i < number) {
            res += str;
            i++;
        }
        return res;
    }

}
