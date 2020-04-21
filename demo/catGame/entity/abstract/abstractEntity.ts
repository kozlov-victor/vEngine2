import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {ArcadePhysicsSystem, ICreateRigidBodyParams} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {Image} from "@engine/renderable/impl/general/image";
import {DebugError} from "@engine/debug/debugError";

export abstract class AbstractEntity {

    public static readonly groupName:string = 'abstractEntity';

    protected renderableImage:RenderableModel;
    protected body:ArcadeRigidBody;

    protected constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>,params:ICreateRigidBodyParams) {
        this.renderableImage = this.onCreatedRenderableModel(spriteSheet);
        this.body = this.onCreatedRigidBody(params);
        this.onCreatedFrameAnimation();
        this.appendToScene();
    }

    public getRenderableModel():RenderableModel {
        return this.renderableImage;
    }

    protected onCreatedRenderableModel(spriteSheet: ResourceLink<ITexture>):RenderableModel {
        const img: Image = new Image(this.game);
        img.setResourceLink(spriteSheet);
        return img;
    }

    protected onCreatedFrameAnimation():void {

    }

    protected createRange(from:number,to:number):number[] {
        if (from>to) throw new DebugError(`can not create range with from=${from} and to=${to}`);
        const arr:number[] = [];
        while (from<=to) {
            arr.push(from++);
        }
        return arr;
    }

    private onCreatedRigidBody(params:ICreateRigidBodyParams):ArcadeRigidBody{
        const rigidBody:ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody(params);
        this.renderableImage.setRigidBody(rigidBody);
        return rigidBody;
    }

    private appendToScene(){
        this.game.getCurrScene().getLayerAtIndex(1).appendChild(this.renderableImage);
        this.renderableImage.transformPoint.setToCenter();
    }


}
