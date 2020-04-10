import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";

export interface IGamePadEvent {
    button: GAME_PAD_BUTTON;
    gamePadIndex:number;
    value:number;
}
