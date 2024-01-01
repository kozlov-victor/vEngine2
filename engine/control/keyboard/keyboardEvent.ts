import {KeyPadEvent} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ObjectPool} from "@engine/misc/objectPool";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";


export class KeyBoardEvent extends KeyPadEvent implements IKeyBoardEvent {

    public static pool = new ObjectPool(KeyBoardEvent);

    public override button:KEYBOARD_KEY;
    public nativeEvent:Event;

}
