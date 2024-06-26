import {AbstractEntity} from "../../abstract/abstractEntity";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Size} from "@engine/geometry/size";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {STRETCH_MODE} from "@engine/renderable/impl/general/image/image";
import {Rect} from "@engine/geometry/rect";

export class Lava extends AbstractEntity {

    public static override readonly groupName:string = 'lava';

    private animation:CellFrameAnimation;

    constructor(game: Game, spriteSheet: ITexture,size:Size) {
        super(game,spriteSheet,{
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            groupNames: [Lava.groupName],
            rect: new Rect(0,0,size.width,size.height)
        });
        this.getRenderableModel().size.setFrom(size);
        this.animation.play();
    }

    protected override onCreatedRenderableModel(spriteSheet: ITexture): RenderableModel {
        const img:AnimatedImage = new AnimatedImage(this.game,spriteSheet);
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game,{
            frames: {to:44},
            duration: 5000,
            numOfFramesHorizontally: 45,
             numOfFramesVertically: 1,
        });
        img.addFrameAnimation(animation);
        img.stretchMode = STRETCH_MODE.REPEAT;
        this.animation = animation;
        (window as any).img = img;
        return img;
    }

}
