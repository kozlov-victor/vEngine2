

import {Moveable} from '../abstract/moveable'
import {Game} from "../../core/game";
import {GameObject} from "../../model/impl/gameObject";
import {Parameters} from "./control4Dir";

export class Move4Dir extends Moveable {

    private static DIRS = ['Left', 'Right', 'Up','Down'];

    constructor(game:Game){
        super(game);
    }

    manage(gameObject:GameObject, parameters:Parameters) {
        this.setDirs(Move4Dir.DIRS);
        super.manage(gameObject, parameters);
    }

    stop() {
        super.stop();
        this.gameObject.rigidBody.mVelocity.x = 0; // todo mVelocity velocity
        this.gameObject.rigidBody.mVelocity.y = 0;
    }

}