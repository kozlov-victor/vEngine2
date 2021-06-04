import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {ArcadePhysicsSystem, ICreateRigidBodyParams} from "@engine/physics/arcade/arcadePhysicsSystem";
import {AbstractSprite} from "./abstractSprite";

export abstract class AbstractEntity extends AbstractSprite {

    public static readonly groupName:string = 'abstractEntity';


    protected body:ArcadeRigidBody;

    protected constructor(game: Game, spriteSheet: ITexture,params:ICreateRigidBodyParams) {
        super(game,spriteSheet);
        this.body = this.onCreatedRigidBody(params);
    }


    private onCreatedRigidBody(params:ICreateRigidBodyParams):ArcadeRigidBody{
        const rigidBody:ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody(params);
        this.renderableImage.setRigidBody(rigidBody);
        return rigidBody;
    }



}
