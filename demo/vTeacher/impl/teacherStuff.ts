import {ICommand} from "./declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {HttpClient} from "@engine/debug/httpClient";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {History} from "./history";
import {Game} from "@engine/core/game";
import {Board} from "./board";

export class TeacherStuff {

    private teacherCommands:ICommand[] = [];
    private currentCommand:ICommand = {points:[]};

    constructor(private game:Game,private board:Board,private surface:DrawingSurface, private history:History) {
        this.listenMouse();
        this.listenKeyboard();
    }

    private listenMouse():void{
        let canvasMouseDowned:boolean = false;
        this.surface.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, e=>{
            canvasMouseDowned = true;
            this.surface.moveTo(e.screenX,e.screenY);
            this.surface.lineTo(e.screenX,e.screenY);
            this.currentCommand.points!.push(+e.screenX.toFixed(2),+e.screenY.toFixed(2));
        });
        this.surface.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            if (e.isMouseDown && canvasMouseDowned) {
                //this.surface.lineTo(e.screenX,e.screenY);
                this.surface.moveTo(e.screenX,e.screenY);
                this.currentCommand.points!.push(+e.screenX.toFixed(2),+e.screenY.toFixed(2));
            }
        });
        this.surface.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, async e=>{
            canvasMouseDowned = false;
            if (this.currentCommand.points?.length===0 && this.currentCommand.extra===undefined) return;
            this.teacherCommands.push(this.currentCommand);
            this.history.addCommand(this.currentCommand);
            this.currentCommand = {points:[]};
            await HttpClient.post('addCommands',this.teacherCommands);
            this.teacherCommands = [];
        });
        this.surface.mouseEventHandler.on(MOUSE_EVENTS.mousePressed, async e=>{
            this.surface.clear();
            this.currentCommand = {points:[]};
            this.teacherCommands = [{extra:'clear'}];
            this.history.clear();
            await HttpClient.post('addCommands',this.teacherCommands);
            this.teacherCommands = [];
        });
    }

    private listenKeyboard():void{
        const kb:KeyboardControl = this.game.getControl<KeyboardControl>('KeyboardControl')!;
        this.game.getCurrScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, async e=>{
            if(kb.isPressed(KEYBOARD_KEY.Z) && kb.isPressed(KEYBOARD_KEY.CONTROL)) {
                this.surface.clear();
                this.history.stepBack();
                const historyCommands:readonly ICommand[] = this.history.getCurrentCommands();
                this.board.execCommands(historyCommands);
                this.teacherCommands.push({extra:historyCommands.length?'undo':'clear'});
                await HttpClient.post('addCommands',this.teacherCommands);
                this.teacherCommands = [];
            }
        });
    }

}
