import {Game} from "@engine/core/game";
import {FastMap} from "@engine/misc/fastMap";

export enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}


export abstract class AbstractKeypad {
    protected game:Game;

    protected abstract keyPressed:string;
    protected abstract keyReleased:string;
    protected abstract keyHold:string;

    private buffer:FastMap<number,KEY_STATE> = new FastMap();


    constructor(game:Game) {
        this.game = game;
    }

    public press(key:number):void{
        if (this.isPressed(key)) return;
        this.buffer.put(key,KEY_STATE.KEY_JUST_PRESSED);
        this.notify(this.keyPressed, key);
    }

    public release(key:number):void{
        if (this.isReleased(key)) return;
        this.buffer.put(key,KEY_STATE.KEY_JUST_RELEASED);
        this.notify(this.keyReleased,key);
    }

    public isPressed(key:number):boolean{
        return this.buffer.get(key)>=KEY_STATE.KEY_PRESSED;
    }

    public isJustPressed(key:number):boolean{
        return this.buffer.get(key)===KEY_STATE.KEY_JUST_PRESSED;
    }

    public isReleased(key:number):boolean{
        if (!this.buffer.has(key)) return true;
        return  this.buffer.get(key)<=KEY_STATE.KEY_JUST_RELEASED;
    }

    public isJustReleased(key:number):boolean {
        return this.buffer.get(key) === KEY_STATE.KEY_JUST_RELEASED;
    }

    public update():void{

        const keys:number[] = this.buffer.getKeys();
        for (const keyNum of keys) {
            const keyVal:KEY_STATE = this.buffer.get(keyNum);
            if (keyVal===KEY_STATE.KEY_RELEASED) this.buffer.remove(keyNum);
            else if (keyVal===KEY_STATE.KEY_JUST_RELEASED) this.buffer.put(keyNum,KEY_STATE.KEY_RELEASED);
            if (keyVal===KEY_STATE.KEY_JUST_PRESSED) {
                this.buffer.put(keyNum,KEY_STATE.KEY_PRESSED);
            }
            this.notify(this.keyHold, keyNum);
        }
    }

    protected notify(eventName:string,key:number):void{
        this.game.getCurrScene().trigger(eventName,key);
    }

}