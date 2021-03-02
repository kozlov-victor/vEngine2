import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";

export class MainScene extends Scene {

    @Resource.Texture('./pixelPerfectStretch3/data/Sprite1.png')
    private sprite:ITexture;


    public onReady():void {

        const sprLogo:AnimatedImage = new AnimatedImage(this.game,this.sprite);
        sprLogo.scale.setXY(5);
        sprLogo.setPixelPerfect(true);
        const cellFrameAnimation = new CellFrameAnimation(this.game);
        cellFrameAnimation.setSpriteSheetSize(3,1);
        cellFrameAnimation.frames = [0,1,2];
        cellFrameAnimation.duration = 1200;
        sprLogo.addFrameAnimation('animation',cellFrameAnimation);
        cellFrameAnimation.play();

        this.appendChild(sprLogo);

    }

}
