import {AbstractEntity} from "../../abstract/abstractEntity";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {Size} from "@engine/geometry/size";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {Rect} from "@engine/geometry/rect";

export class Lava extends AbstractEntity {

    public static readonly groupName:string = 'lava';

    private animation:CellFrameAnimation;

    constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>,size:Size) {
        super(game,spriteSheet,{
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            groupNames: [Lava.groupName],
            rect: new Rect(0,0,size.width,size.height)
        });
        this.getRenderableModel().size.set(size);
        this.animation.play();
    }

    protected onCreatedRenderableModel(spriteSheet: ResourceLink<ITexture>): RenderableModel {
        const img:AnimatedImage = new AnimatedImage(this.game);
        img.setResourceLink(spriteSheet);
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game);
        animation.frames = this.createRange(0,44);
        animation.duration = 5000;
        animation.setSpriteSheetSize(new Size(45,1));
        img.addFrameAnimation('lavaAni',animation);
        img.stretchMode = STRETCH_MODE.REPEAT;
        this.animation = animation;
        (window as any).img = img;
        return img;
    }

}
