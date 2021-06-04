
export class DebugError extends Error {

    public errorMessage:string;

    constructor(message:string){
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }

        this.name = 'DebugError';
        this.errorMessage = message;
    }

    public override toString():string{
        return this.errorMessage;
    }

}
