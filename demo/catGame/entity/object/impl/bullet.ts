import {AbstractEntity} from "../../abstract/abstractEntity";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Hero} from "../../actor/impl/hero";

export class Bullet extends AbstractEntity {

    private constructor(game: Game, spriteSheet:ITexture) {
        super(game,spriteSheet,{
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            groupNames: [Bullet.groupName],
            ignoreCollisionWithGroupNames: [Hero.groupName,Bullet.groupName],
            rect: new Rect(0,0,8,2),
            //debug: true
        });
        this.getRenderableModel().size.setWH(8,8);
        this.animation.play();
        this.game.getCurrentScene().setTimeout(()=>{
            this.getRenderableModel().removeSelf();
        },2000);
    }

    public static override readonly groupName:string = 'bullet';

    private static spriteSheet: ITexture;

    private animation:CellFrameAnimation;

    public static init(spriteSheet: ITexture):void{
        Bullet.spriteSheet = spriteSheet;
    }

    public static emit(game:Game):Bullet{
        return new Bullet(game,Bullet.spriteSheet);
    }

    protected override onCreatedRenderableModel(spriteSheet: ITexture): RenderableModel {
        const img:AnimatedImage = new AnimatedImage(this.game,spriteSheet);
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game,{
            frames: [0,1,2,3,4,3,2,1],
            duration: 300,
            numOfFramesHorizontally: 3,
            numOfFramesVertically: 3,
        });
        img.addFrameAnimation(animation);
        this.animation = animation;
        return img;
    }

}
