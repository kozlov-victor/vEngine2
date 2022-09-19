import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IRectJSON} from "@engine/geometry/rect";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {Scene} from "@engine/scene/scene";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";

export class MainScene extends Scene {

    @Resource.Texture("./atlas/player.png")
    public readonly spriteTexture: ITexture;

    @Resource.JSON("./atlas/player.atlas")
    public readonly atlas: any;

    constructor(game:Game){
        super(game);
    }

    public override onReady():void {

        const animatedImage: AnimatedImage = new AnimatedImage(this.game,this.spriteTexture);
        const texturePackerAtlas = new TexturePackerAtlas(this.atlas);

        const animRun: AtlasFrameAnimation = new AtlasFrameAnimation(this.game,{
            frames: [
                texturePackerAtlas.getFrameByKey("run-01"),
                texturePackerAtlas.getFrameByKey("run-02"),
                texturePackerAtlas.getFrameByKey("run-03"),
                texturePackerAtlas.getFrameByKey("run-04"),
                texturePackerAtlas.getFrameByKey("run-05"),
                texturePackerAtlas.getFrameByKey("run-06"),
                texturePackerAtlas.getFrameByKey("run-07"),
                texturePackerAtlas.getFrameByKey("run-08")
            ],
            isRepeating: true,
            duration: 1000,
        });


        const animJump: AtlasFrameAnimation = new AtlasFrameAnimation(this.game,{
            frames: [
                texturePackerAtlas.getFrameByKey("jump-down"),
                texturePackerAtlas.getFrameByKey("jump-up"),
            ],
            isRepeating: false,
            duration: 800,
        });
        animJump.animationEventHandler.on(FRAME_ANIMATION_EVENTS.completed, () => {
            animRun.play();
        });

        animatedImage.addFrameAnimation(animRun);
        animatedImage.addFrameAnimation(animJump);
        animRun.play();

        animatedImage.mouseEventHandler.on(MOUSE_EVENTS.click, _ => {
            animJump.play();
        });

        animatedImage.pos.setFrom({x: 10, y: 10});
        this.appendChild(animatedImage);

    }

}
