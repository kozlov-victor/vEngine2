import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {History} from "./history";
import {Comet} from "./comet";
import {ICommand} from "./declarations";
import {Game} from "@engine/core/game";
import {TeacherStuff} from "./teacherStuff";

export class Board {

    private history:History = new History();
    private comet:Comet = new Comet((r)=>{
        const commands:ICommand[] = r.commands;
        commands.forEach(command=>{
            if (command.extra==='undo') {
                this.surface.clear();
                this.history.stepBack();
                this.execCommands(this.history.getCurrentCommands());
            } else {
                this.history.addCommand(command);
                this.execCommand(command);
            }
        });
    },!this.isTeacher);

    private execCommand(command:ICommand):void{
        if (command.extra==='clear') {
            this.surface.clear();
            this.history.clear();
        }
        else {
            if (command.points?.length) this.surface.drawPolyline(command.points);
        }
    }

    public execCommands(commands:readonly ICommand[]):void{
        commands?.forEach(c=>this.execCommand(c));
    };

    constructor(private game:Game,private surface:DrawingSurface,private isTeacher:boolean) {
        surface.setDrawColor(120,222,200);
        surface.setLineWidth(2);
        if (isTeacher) this.initTeacherStuff();
    }

    private initTeacherStuff():void{
        const teacherStuff:TeacherStuff = new TeacherStuff(this.game,this,this.surface,this.history);
    }


}
