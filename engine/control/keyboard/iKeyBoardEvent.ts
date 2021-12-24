import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export interface IKeyBoardEvent { // todo remove? investigate
    button: KEYBOARD_KEY;
    nativeEvent:Event;
}
