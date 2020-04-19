import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/geometry/animatedImage";
import {Size} from "@engine/geometry/size";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {AbstractEntity} from "../../abstract/abstractEntity";


export interface IExtraProperties {
    fromX?:number;
    toX?:number;
    fromY?:number;
    toY?:number;
}

export abstract class AbstractCharacter extends AbstractEntity {

    protected renderableImage:AnimatedImage;

    protected walkAnimation:CellFrameAnimation;
    protected idleAnimation:CellFrameAnimation;
    protected attackAnimation:CellFrameAnimation;
    protected jumpAnimation:CellFrameAnimation;

    protected velocity:number = 10;

    protected constructor(protected game:Game, spr:ResourceLink<ITexture>) {
        super(game);
        const img:AnimatedImage = new AnimatedImage(game);
        this.renderableImage = img;
        img.setResourceLink(spr);
    }

    protected createFrameAnimation(name:string,frames:number[], duration:number, spriteSheetSize:Size):CellFrameAnimation {
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game);
        animation.frames = frames;
        animation.duration = duration;
        animation.setSpriteSheetSize(spriteSheetSize);
        this.renderableImage.addFrameAnimation(name,animation);
        return animation;
    }

    protected appendToScene(){
        this.game.getCurrScene().getLayerAtIndex(1).appendChild(this.renderableImage);
        this.renderableImage.transformPoint.setToCenter();
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
        if (this.body.collisionFlags.bottom) this.body.velocity.y -=velY;
        if (this.jumpAnimation!==undefined) {
            this.jumpAnimation.play().once(FRAME_ANIMATION_EVENTS.completed, ev=>this.idleAnimation.play());
        }
    }

    protected postConstruct(){
        this.idle();
        this.appendToScene();
    }


}
