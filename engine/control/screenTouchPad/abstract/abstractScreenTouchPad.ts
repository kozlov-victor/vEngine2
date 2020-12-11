import {AbstractScreenTouchButton} from "@engine/control/screenTouchPad/abstract/abstractScreenTouchButton";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Layer} from "@engine/scene/layer";
import {Game} from "@engine/core/game";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";


export abstract class AbstractScreenTouchPad {

    private _buttons:AbstractScreenTouchButton[] =[];

    protected constructor(protected game:Game) {
    }

    protected addButton(b:AbstractScreenTouchButton):void {
        this._buttons.push(b);
        const kbControl:KeyboardControl = this.game.getControl<KeyboardControl>('KeyboardControl')!;
        b.renderableModel.on(MOUSE_EVENTS.mouseDown,e=>{
            kbControl.triggerKeyPress(b.keyCode,e.nativeEvent);
        });
        b.renderableModel.on(MOUSE_EVENTS.mouseLeave,e=>{
            kbControl.triggerKeyRelease(b.keyCode,e.nativeEvent);
        });
        b.renderableModel.on(MOUSE_EVENTS.mouseUp,e=>{
            kbControl.triggerKeyRelease(b.keyCode,e.nativeEvent);
        });
    }

    public appendTo(layer:Layer):void {
        this._buttons.forEach(b=>{
            layer.appendChild(b.renderableModel);
        });
    }

    public releaseAllButtons():void{
        this._buttons.forEach(b=>{
            this.game.getControl<KeyboardControl>('KeyboardControl')!.triggerKeyRelease(b.keyCode,undefined!);
        });
    }


}
