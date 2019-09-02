import {Game} from "@engine/core/game";
import {FastMap} from "@engine/misc/fastMap";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";

export enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}


export abstract class KeyPadEvent extends ObservableEntity {
    public keyState:KEY_STATE;
}

export abstract class AbstractKeypad {
    protected game:Game;

    protected abstract keyPressed:string;
    protected abstract keyReleased:string;
    protected abstract keyHold:string;

    private buffer:FastMap<number,KeyPadEvent> = new FastMap();


    constructor(game:Game) {
        this.game = game;
    }

    public press(key:number,event:KeyPadEvent):void{
        event.keyState = KEY_STATE.KEY_JUST_PRESSED;
        this.buffer.put(key,event);
        this.notify(this.keyPressed,event);
    }

    public release(key:number,event:KeyPadEvent):void{
        if (this.isReleased(key)) return;
        event.keyState = KEY_STATE.KEY_JUST_RELEASED;
        //this.buffer.put(key,event); // todo need?
        this.notify(this.keyReleased,event);
    }

    public isPressed(key:number):boolean{
        if (!this.buffer.has(key)) return false;
        return this.buffer.get(key)!.keyState>=KEY_STATE.KEY_PRESSED;
    }

    public isJustPressed(key:number):boolean{
        if (!this.buffer.has(key)) return false;
        return this.buffer.get(key)!.keyState===KEY_STATE.KEY_JUST_PRESSED;
    }

    public isReleased(key:number):boolean{
        if (!this.buffer.has(key)) return true;
        return  this.buffer.get(key)!.keyState<=KEY_STATE.KEY_JUST_RELEASED;
    }

    public isJustReleased(key:number):boolean {
        if (!this.buffer.has(key)) return false;
        return this.buffer.get(key)!.keyState === KEY_STATE.KEY_JUST_RELEASED;
    }

    public update():void{

        const keys:number[] = this.buffer.getKeys();
        for (const keyNum of keys) {
            const event:KeyPadEvent = this.buffer.get(keyNum)!;
            const keyVal:KEY_STATE = event.keyState;
            if (keyVal===KEY_STATE.KEY_RELEASED) {
                this.buffer.remove(keyNum);
                event.release();
            }
            else if (keyVal===KEY_STATE.KEY_JUST_RELEASED) event.keyState = KEY_STATE.KEY_RELEASED;
            if (keyVal===KEY_STATE.KEY_JUST_PRESSED) {
                event.keyState = KEY_STATE.KEY_PRESSED;
            }
            this.notify(this.keyHold, event);
        }
    }

    protected getEvent(key:number):KeyPadEvent|null {
        return this.buffer.get(key);
    }

    protected notify(eventName:string,e:KeyPadEvent):void{
        //console.log(eventName,(e as any).key);
        this.game.getCurrScene().trigger(eventName,e);
    }

}