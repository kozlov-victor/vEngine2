import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";

export class MainScene extends Scene {

    @Resource.Texture('./pixelPerfectStretch3/data/Sprite1.png')
    private sprite:ITexture;


    public override onReady():void {

        const sprLogo:AnimatedImage = new AnimatedImage(this.game,this.sprite);
        sprLogo.scale.setXY(5);
        sprLogo.setPixelPerfect(true);
        const cellFrameAnimation = new CellFrameAnimation(this.game,{
            name: 'animation',
            frames: [0,1,2],
            duration: 1200,
            numOfFramesHorizontally: 3,
            numOfFramesVertically: 1,
        });
        sprLogo.addFrameAnimation(cellFrameAnimation);
        cellFrameAnimation.play();

        this.appendChild(sprLogo);

    }

}
