import {Widget} from "./widget";

export class CommandsAttacher {
    constructor(private widget:Widget) {
    }

    private attachCommonCommands() {
        const print = (...args:string[]|number[])=>{
            this.widget.print(...args);
        }

        const input = (prompt:string)=>{
            const literal = this.widget.input(prompt);
            if (Number.isFinite(+literal)) return +literal;
            else return literal;
        }

        const catchError = (e:any):void=>{
            this.widget.catchError(e);
        }

        const clearScreen = ():void=>{
            this.widget.clearScreen();
        }

        return {
            print,
            input,
            catchError,
            clearScreen
        };
    }

    private attachGraphicsCommands() {
        const drawPoint = (x:number,y:number,color:string)=>{
            //
        }
        return {
            drawPoint,
        }
    }

    public init() {
        return {...this.attachCommonCommands(),...this.attachGraphicsCommands()}
    }

}
