import {KeyPadEvent} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ObjectPool} from "@engine/misc/objectPool";
import {Optional} from "@engine/core/declarations";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";


export class KeyBoardEvent extends KeyPadEvent implements IKeyBoardEvent {

    private static _pool:ObjectPool<KeyBoardEvent> = new ObjectPool<KeyBoardEvent>(KeyBoardEvent);

    public override button:KEYBOARD_KEY;
    public nativeEvent:Event;

    public static fromPool():Optional<KeyBoardEvent> {
        return KeyBoardEvent._pool.getFreeObject();
    }

}
