import {ICommand} from "./declarations";

export class History {

    private commands:ICommand[] = [];

    public stepBack():void{
        this.commands.pop();
    }

    public getCurrentCommands():readonly ICommand[] {
        return this.commands;
    }

    public addCommand(command:ICommand):void {
        this.commands.push(command);
    }

    public addCommands(commands:ICommand[]):void {
        this.commands.push(...commands);
    }

    public clear():void {
        this.commands.length = 0;
    }

}
