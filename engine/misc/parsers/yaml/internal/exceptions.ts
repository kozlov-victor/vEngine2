export class ParseException extends Error {

    constructor(public override message: string, private parsedLine?: number, private snippet?: string) {
        super(message);
    }

    public override toString(): string {
        if ((this.parsedLine != null) && (this.snippet != null)) {
            return '<ParseException> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
        } else {
            return '<ParseException> ' + this.message;
        }
    }
}

export class ParseMore extends Error {
    constructor(public override message: string, private parsedLine?: number, private snippet?: string) {
        super(message);
    }

    public override toString(): string {
        if ((this.parsedLine != null) && (this.snippet != null)) {
            return '<ParseMore> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
        } else {
            return '<ParseMore> ' + this.message;
        }
    }
}
