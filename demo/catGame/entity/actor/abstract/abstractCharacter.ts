import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {Size} from "@engine/geometry/size";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {AbstractEntity} from "../../abstract/abstractEntity";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICreateRigidBodyParams} from "@engine/physics/arcade/arcadePhysicsSystem";


export interface IExtraProperties {
    fromX?:number;
    toX?:number;
    fromY?:number;
    toY?:number;
}

export abstract class AbstractCharacter extends AbstractEntity {

    public static override readonly groupName:string = 'abstractCharacter';

    declare protected renderableImage:AnimatedImage;

    protected walkAnimation:CellFrameAnimation;
    protected idleAnimation:CellFrameAnimation;
    protected attackAnimation:CellFrameAnimation;
    protected jumpAnimation:CellFrameAnimation;

    protected velocity:number = 10;

    protected constructor(game:Game, spr:ITexture,params:ICreateRigidBodyParams) {
        super(game,spr,params);
        this.idle();
    }

    protected override onCreatedRenderableModel(spriteSheet: ITexture): RenderableModel {
        return new AnimatedImage(this.game, spriteSheet);
    }

    protected createFrameAnimation(name:string,frames:number[], duration:number, spriteSheetSize:Size):CellFrameAnimation {
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game,{
            name,
            frames,
            duration,
            numOfFramesHorizontally: spriteSheetSize.width,
            numOfFramesVertically: spriteSheetSize.height,
        });
        this.renderableImage.addFrameAnimation(animation);
        return animation;
    }

    protected goLeft():void {
        this.body.velocity.x = -Math.abs(this.velocity);
        this.renderableImage.scale.x = -1;
        this.walkAnimation.play();
    }

    protected goRight():void {
        this.body.velocity.x = Math.abs(this.velocity);
        this.renderableImage.scale.x = 1;
        this.walkAnimation.play();
    }

    protected idle():void {
        this.body.velocity.x = 0;
        this.idleAnimation.play();
    }

    protected jump(velY:number):void {
        if (this.body.collisionFlags.bottom) {
            this.body.velocity.y -=velY;
        }
        if (this.jumpAnimation!==undefined) {
            this.jumpAnimation.play().animationEventHandler.once(FRAME_ANIMATION_EVENTS.completed, ev=>this.idleAnimation.play());
        }
    }


}
