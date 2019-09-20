import {KeyPadEvent} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ObjectPool} from "@engine/misc/objectPool";
import {Optional} from "@engine/core/declarations";

export enum KEYBOARD_EVENTS {
    keyPressed = 'keyPressed',
    keyReleased = 'keyReleased',
    keyHold = 'keyHold'
}

export class KeyBoardEvent extends KeyPadEvent {

    public static fromPool():Optional<KeyBoardEvent> {
        return KeyBoardEvent.rectPool.getFreeObject();
    }

    private static rectPool:ObjectPool<KeyBoardEvent> = new ObjectPool<KeyBoardEvent>(KeyBoardEvent);

    public key:KEYBOARD_KEY;

}