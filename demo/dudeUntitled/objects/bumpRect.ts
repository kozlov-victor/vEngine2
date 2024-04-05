import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {MainScene} from "../mainScene";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";

export class BumpRect {

    public static NAME = 'BumpRect';

    constructor(private scene:MainScene,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {

        const obj = new SimpleGameObjectContainer(scene.getGame());
        obj.pos.setXY(tiledObject.x,tiledObject.y);
        obj.size.setWH(tiledObject.width,tiledObject.height);
        obj.setRigidBody(scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect: undefined,
            acceptCollisions: false,
            groupNames: ['bump']
        }));
        obj.getRigidBody<ArcadeRigidBody>().addInfo.host = this;
        obj.appendTo(scene);
    }

}
