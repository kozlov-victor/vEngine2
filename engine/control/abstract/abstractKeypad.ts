import {Game} from "@engine/core/game";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";
import {DebugError} from "@engine/debug/debugError";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {Optional} from "@engine/core/declarations";
import {KeyBoardEvent} from "@engine/control/keyboard/keyboardEvent";

export const enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}


export abstract class KeyPadEvent extends ObservableEntity {
    public keyState:KEY_STATE;
    public button: number;
    public nativeEvent: any;
}

export abstract class AbstractKeypad<T extends KeyPadEvent> {

    public type:string;

    private reflectKey = {
        control: undefined as AbstractKeypad<any>|undefined,
        map: undefined as Record<number, number>|undefined
    }

    protected abstract recycleEvent(e:T):void;
    protected abstract createEvent():T;

    private buffer:T[] = [];

    constructor(protected game: Game) {}

    public reflectToControl(control: AbstractKeypad<any>, map: Record<number, number>): void {
        this.reflectKey.control = control;
        this.reflectKey.map = map;
    }

    public reflectToSelf(map: Record<number, number>): void {
        this.reflectToControl(this,map);
    }

    public press(button:number,nativeEvent:any): void {
        if (this.isPressed(button)) {
            return;
        }
        const event = this.createEvent();
        event.button = button;
        event.keyState = KEY_STATE.KEY_PRESSED;
        event.nativeEvent = nativeEvent;
        this.buffer.push(event);
        this.onEventTriggered(KEYBOARD_EVENTS.keyPressed, event);
        if (this.reflectKey.control !== undefined && this.reflectKey.map![button]!==undefined) {
            this.reflectKey.control.press(this.reflectKey.map![button],nativeEvent);
        }
    }

    public release(button:number,nativeEvent:any): void {
        if (!this.isPressed(button)) {
            return;
        }
        const event = this.findEvent(button);
        if (!event) return;
        event.button = button;
        event.keyState = KEY_STATE.KEY_JUST_RELEASED;
        this.onEventTriggered(KEYBOARD_EVENTS.keyReleased, event);
        if (this.reflectKey.control !== undefined && this.reflectKey.map![button]!==undefined) {
            this.reflectKey.control.release(this.reflectKey.map![button],nativeEvent);
        }
    }

    public isJustPressed(key:number):boolean{
        const event = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState===KEY_STATE.KEY_JUST_PRESSED;
    }

    public isJustReleased(key:number):boolean {
        const event = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState === KEY_STATE.KEY_JUST_RELEASED;
    }

    public isPressed(key:number):boolean{
        const event = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState>=KEY_STATE.KEY_PRESSED;
    }

    private findEvent(button:number):Optional<T> {
        for (const event of this.buffer) {
            if (event.button===button) return event;
        }
        return undefined;
    }


    public update(): void {
        for (const event of this.buffer) {
            const keyVal = event.keyState;
            switch (keyVal) {
                case KEY_STATE.KEY_RELEASED:
                    this.buffer.splice(this.buffer.indexOf(event), 1);
                    this.recycleEvent(event);
                    break;
                case KEY_STATE.KEY_JUST_RELEASED:
                    event.keyState = KEY_STATE.KEY_RELEASED;
                    break;
                case KEY_STATE.KEY_JUST_PRESSED:
                    event.keyState = KEY_STATE.KEY_PRESSED;
                    break;
                case KEY_STATE.KEY_PRESSED:
                    this.onEventTriggered(KEYBOARD_EVENTS.keyHold, event);
                    break;
                default:
                    if (DEBUG) throw new DebugError(`unknown button state: ${keyVal}`);
                    break;
            }
        }
    }

    protected onEventTriggered(eventName: KEYBOARD_EVENTS, e: T): void {
    }

}
