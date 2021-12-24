import {Game} from "@engine/core/game";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";
import {DebugError} from "@engine/debug/debugError";

export const enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}


export abstract class KeyPadEvent extends ObservableEntity {
    public keyState:KEY_STATE;
    public button: number;
}

export abstract class AbstractKeypad<T extends KeyPadEvent> {
    protected game: Game;

    protected abstract keyPressed: string;
    protected abstract keyReleased: string;
    protected abstract keyHold: string;

    protected buffer: T[] = [];

    private reflectKey: { control: AbstractKeypad<any> | undefined, map: Record<number, number> | undefined } = {
        control: undefined,
        map: undefined
    }


    constructor(game: Game) {
        this.game = game;
    }

    public reflectToControl(control: AbstractKeypad<any>, map: Record<number, number>): void {
        this.reflectKey.control = control;
        this.reflectKey.map = map;
    }

    public press(event: T): void {
        event.keyState = KEY_STATE.KEY_PRESSED;
        this.buffer.push(event);
        this.notify(this.keyPressed, event);
        this._reflectPressOrRelease(event,true);
    }

    public release(event: T): void {
        event.keyState = KEY_STATE.KEY_JUST_RELEASED;
        this.notify(this.keyReleased, event);
        this._reflectPressOrRelease(event,false);
    }

    public update(): void {
        for (const event of this.buffer) {
            if (!event.isCaptured()) continue;
            const keyVal: KEY_STATE = event.keyState;
            switch (keyVal) {
                case KEY_STATE.KEY_RELEASED:
                    this.buffer.splice(this.buffer.indexOf(event), 1);
                    event.release();
                    break;
                case KEY_STATE.KEY_JUST_RELEASED:
                    event.keyState = KEY_STATE.KEY_RELEASED;
                    break;
                case KEY_STATE.KEY_JUST_PRESSED:
                    event.keyState = KEY_STATE.KEY_PRESSED;
                    break;
                case KEY_STATE.KEY_PRESSED:
                    this.notify(this.keyHold, event);
                    break;
                default:
                    if (DEBUG) throw new DebugError(`unknown button state: ${keyVal}`);
                    break;
            }
        }
    }

    protected abstract notify(eventName: string, e: T): void;

    private _reflectPressOrRelease(e:T,isPress:boolean):void {
        if (this.reflectKey.control !== undefined && this.reflectKey.map![e.button]) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const clonedEvent = new class extends KeyPadEvent {
                constructor() {
                    super();
                    this.keyState = e.keyState;
                    this.button = self.reflectKey.map![e.button]
                }
            }
            if (isPress) this.reflectKey.control!.press(clonedEvent);
            else this.reflectKey.control!.release(clonedEvent);
        }
    }

}
