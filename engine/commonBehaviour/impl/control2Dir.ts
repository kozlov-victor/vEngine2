
import {Move2Dir} from './move2Dir'
import {GameObject} from "../../model/impl/gameObject";
import {Game} from "../../core/game";
import {IKeyVal} from "../../core/misc/object";
import {KEY} from "@engine/core/control/keyboard";


export class Parameters implements IKeyVal {
    velocity: number = 100;
    walkLeftAnimation: string = 'left';
    walkRightAnimation: string = 'right';
    idleLeftAnimation: string = 'idleLeft';
    idleRightAnimation: string = 'idleRight';
}

export class Control2Dir extends Move2Dir{

    constructor(game:Game){
        super(game);
    }

    manage(gameObject:GameObject,parameters:Parameters) {
        super.manage(gameObject,parameters);
    }

    onUpdate(){
        const keyboard = this.game.keyboard;
        const parameters  = this.parameters;
        const go:GameObject = this.gameObject;
        if (keyboard.isJustPressed(KEY.LEFT) || keyboard.isJustPressed(KEY.GAME_PAD_AXIS_LEFT)) {
            go.rigidBody.mAcceleration.x = -parameters['velocity'];
            this.go('Left');
        }
        if (keyboard.isJustPressed(KEY.RIGHT) || keyboard.isJustPressed(KEY.GAME_PAD_AXIS_RIGHT)) {
            go.rigidBody.mAcceleration.x = parameters['velocity'];
            this.go('Right');
        }

        if (keyboard.isJustReleased(KEY.LEFT) || keyboard.isJustReleased(KEY.GAME_PAD_AXIS_LEFT)) {
            this.stop();
        } else if (keyboard.isJustReleased(KEY.RIGHT) || keyboard.isJustReleased(KEY.GAME_PAD_AXIS_RIGHT)) {
            this.stop();
        }
    }

}