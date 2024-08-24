import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export interface IKeyBoardEvent {
    button: KEYBOARD_KEY;
    nativeEvent:Event;
}
