import {Optional} from "@engine/core/declarations";
import {IKeyboardFocusable} from "@engine/renderable/impl/ui/textField/_internal/iKeyboardFocusable";

export namespace CurrentIKeyBoardFocusable {

    let currentKeyBoardFocusable:Optional<IKeyboardFocusable>;

    export const setFocusable = (focusable:Optional<IKeyboardFocusable>):void=>{
        currentKeyBoardFocusable = focusable;
    };

    export const isFocusable = (focusable:IKeyboardFocusable):boolean=>{
        return currentKeyBoardFocusable===focusable;
    };

}
