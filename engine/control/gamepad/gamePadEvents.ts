import {KeyPadEvent} from "@engine/control/abstract/abstractKeypad";
import {ObjectPool} from "@engine/misc/objectPool";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {Optional} from "@engine/core/declarations";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";



export class GamePadEvent extends KeyPadEvent implements IGamePadEvent {

    private static pool:ObjectPool<GamePadEvent> = new ObjectPool<GamePadEvent>(GamePadEvent);

    public override button: GAME_PAD_BUTTON;
    public gamePadIndex:number;
    public value:number;

    public static fromPool():Optional<GamePadEvent> {
        return GamePadEvent.pool.getFreeObject(true);
    }

}
