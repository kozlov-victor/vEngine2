import {IRigidBody} from "@engine/physics/common/interfaces";

export class TileMapRigidBodyDelegate {

    constructor(private rigidBodies:IRigidBody[]) {

    }

    public nextTick() {
        for (let i = 0; i < this.rigidBodies.length; i++) {
            const rigidBody = this.rigidBodies[i];
            rigidBody.nextTick();
        }
    }

}
