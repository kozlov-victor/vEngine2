import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem, ICreateRigidBodyParams} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {Game} from "@engine/core/game";

export abstract class AbstractEntity {

    protected renderableImage:RenderableModel;
    protected body:ArcadeRigidBody;

    protected constructor(protected game:Game) {
    }

    public getRenderableModel():RenderableModel {
        return this.renderableImage;
    }

    protected createRigidBody(params:ICreateRigidBodyParams):void{
        const rigidBody:ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody(params);
        this.renderableImage.setRigidBody(rigidBody);
        this.body = rigidBody;
    }

}
