import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export interface IKeyBoardEvent {
    key: KEYBOARD_KEY;
    nativeEvent:Event;
}
