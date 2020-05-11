import {KeyPadEvent} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ObjectPool} from "@engine/misc/objectPool";
import {Optional} from "@engine/core/declarations";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";

export enum KEYBOARD_EVENTS {
    keyPressed = 'keyPressed',
    keyReleased = 'keyReleased',
    keyHold = 'keyHold'
}

export class KeyBoardEvent extends KeyPadEvent implements IKeyBoardEvent {

    public static fromPool():Optional<KeyBoardEvent> {
        return KeyBoardEvent.pool.getFreeObject();
    }

    private static pool:ObjectPool<KeyBoardEvent> = new ObjectPool<KeyBoardEvent>(KeyBoardEvent);

    public key:KEYBOARD_KEY;

}
