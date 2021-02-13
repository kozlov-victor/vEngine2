import {AbstractEntity} from "../../abstract/abstractEntity";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {Hero} from "../../actor/impl/hero";

export class Bullet extends AbstractEntity {

    private constructor(protected game: Game, spriteSheet:ITexture) {
        super(game,spriteSheet,{
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            groupNames: [Bullet.groupName],
            ignoreCollisionWithGroupNames: [Hero.groupName,Bullet.groupName],
            rect: new Rect(0,0,8,2),
            //debug: true
        });
        this.getRenderableModel().size.setWH(8,8);
        this.animation.play();
        this.game.getCurrScene().setTimeout(()=>{
            this.getRenderableModel().removeSelf();
        },2000);
    }

    public static readonly groupName:string = 'bullet';

    private static spriteSheet: ITexture;

    private animation:CellFrameAnimation;

    public static init(spriteSheet: ITexture):void{
        Bullet.spriteSheet = spriteSheet;
    }

    public static emit(game:Game):Bullet{
        return new Bullet(game,Bullet.spriteSheet);
    }

    protected onCreatedRenderableModel(spriteSheet: ITexture): RenderableModel {
        const img:AnimatedImage = new AnimatedImage(this.game,spriteSheet);
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game);
        animation.frames = [0,1,2,3,4,3,2,1];
        animation.duration = 300;
        animation.setSpriteSheetSize(new Size(3,3));
        img.addFrameAnimation('bulletAni',animation);
        this.animation = animation;
        return img;
    }

}
