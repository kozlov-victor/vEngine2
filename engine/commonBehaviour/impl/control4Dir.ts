


import {Move4Dir} from './move4Dir'
import {Game} from "../../core/game";
import {GameObject} from "../../model/impl/gameObject";
import {IKeyVal} from "../../core/misc/object";
import {KEY} from "@engine/core/control/keyboard";


export class Parameters implements IKeyVal {
    velocity: number = 100;
    walkLeftAnimation: string = 'left';
    walkRightAnimation: string = 'right';
    walkUpAnimation: string = 'up';
    walkDownAnimation: string = 'down';
    idleLeftAnimation: string = 'idleLeft';
    idleRightAnimation: string = 'idleRight';
    idleUpAnimation: string = 'idleUp';
    idleDownAnimation: string = 'idleDown';
}

export class Control4Dir extends Move4Dir {

    constructor(game:Game){
        super(game);
    }

    manage(gameObject:GameObject,parameters:Parameters) {
        super.manage(gameObject,parameters);
    }

    onUpdate(){
        const keyboard = this.game.keyboard;
        const parameters:Parameters  = this.parameters as Parameters;
        const go = this.gameObject;
        if (keyboard.isPressed(KEY.UP) || keyboard.isPressed(KEY.GAME_PAD_AXIS_UP)) {
            go.rigidBody.mVelocity.y = -parameters.velocity; // todo interface parameters // todo velocity mVelocity
            this.go('Up');
        }
        if (keyboard.isPressed(KEY.DOWN) || keyboard.isPressed(KEY.GAME_PAD_AXIS_DOWN)) {
            go.rigidBody.mVelocity.y = parameters.velocity;
            this.go('Down');
        }
        if (keyboard.isPressed(KEY.LEFT) || keyboard.isPressed(KEY.GAME_PAD_AXIS_LEFT)) {
            go.rigidBody.mVelocity.x = -parameters.velocity;
            this.go('Left');
        }
        if (keyboard.isPressed(KEY.RIGHT) || keyboard.isPressed(KEY.GAME_PAD_AXIS_RIGHT)) {
            go.rigidBody.mVelocity.x = parameters.velocity;
            this.go('Right');
        }

        if (keyboard.isJustReleased(KEY.LEFT) || keyboard.isPressed(KEY.GAME_PAD_AXIS_LEFT)) {
            this.stop();
        } else if (keyboard.isJustReleased(KEY.RIGHT) || keyboard.isPressed(KEY.GAME_PAD_AXIS_RIGHT)) {
            this.stop();
        } else if (keyboard.isJustReleased(KEY.UP) || keyboard.isPressed(KEY.GAME_PAD_AXIS_UP)) {
            this.stop();
        } else if (keyboard.isJustReleased(KEY.DOWN) || keyboard.isPressed(KEY.GAME_PAD_AXIS_DOWN)) {
            this.stop();
        }
    }

}