import {KeyPadEvent} from "@engine/control/abstract/abstractKeypad";
import {ObjectPool} from "@engine/misc/objectPool";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";

export enum GAME_PAD_EVENTS {
    buttonPressed = 'buttonPressed',
    buttonReleased = 'buttonReleased',
    buttonHold = 'buttonHold'
}


export class GamePadEvent extends KeyPadEvent {

    public static fromPool():Optional<GamePadEvent> {
        return GamePadEvent.rectPool.getFreeObject(true);
    }

    private static rectPool:ObjectPool<GamePadEvent> = new ObjectPool<GamePadEvent>(GamePadEvent);

    public button: GAME_PAD_BUTTON;
    public gamePadIndex:number;
    public value:number;

}