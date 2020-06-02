import {AbstractScreenTouchButton} from "@engine/control/screenTouchPad/abstract/abstractScreenTouchButton";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Layer} from "@engine/scene/layer";
import {Game} from "@engine/core/game";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";


export abstract class AbstractScreenTouchPad {

    private _buttons:AbstractScreenTouchButton[] =[];

    protected constructor(protected game:Game) {
    }

    public addButton(b:AbstractScreenTouchButton):void {
        this._buttons.push(b);
        b.renderableModel.on(MOUSE_EVENTS.mouseDown,()=>{
            this.game.getControl<KeyboardControl>('KeyboardControl')!.triggerKeyPress(b.keyCode);
        });
        b.renderableModel.on(MOUSE_EVENTS.mouseLeave,()=>{
            this.game.getControl<KeyboardControl>('KeyboardControl')!.triggerKeyRelease(b.keyCode);
        });
        b.renderableModel.on(MOUSE_EVENTS.mouseUp,()=>{
            this.game.getControl<KeyboardControl>('KeyboardControl')!.triggerKeyRelease(b.keyCode);
        });
    }

    public appendTo(layer:Layer) {
        this._buttons.forEach(b=>{
            layer.appendChild(b.renderableModel);
        });
    }


}
