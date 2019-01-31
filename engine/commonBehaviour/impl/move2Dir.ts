


import {Moveable} from '../abstract/moveable'
import {Game} from "../../core/game";
import {GameObject} from "../../model/impl/gameObject";
import {Parameters} from "./control2Dir";

export class Move2Dir extends Moveable {

    private static DIRS = ['Left', 'Right'];

    constructor(game:Game){
        super(game);
    }

    manage(gameObject:GameObject, parameters:Parameters) {
        this.setDirs(Move2Dir.DIRS);
        super.manage(gameObject, parameters);
    }

    stop() {
        super.stop();
        this.gameObject.rigidBody.mAcceleration.x = 0;
        this.gameObject.rigidBody.mVelocity.x = 0;
    }

}