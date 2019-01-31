
export class DebugError extends Error {

    errorMessage:string;

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

    toString(){
        return this.errorMessage;
    }

}