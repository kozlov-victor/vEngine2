import {Scene} from "@engine/scene/scene";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {IRectJSON} from "@engine/geometry/rect";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";

const toFrame = (frame:any):IRectJSON=> {
    const {x,y,w:width,h:height} = frame;
    return {x,y,width,height};
}

export class MainScene extends Scene {

    @Resource.ResourceHolder() private assets:Assets;

    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS(`#940202`);

        const characterImage = new AnimatedImage(this.game,this.assets.characterTexture);
        const texturePackerAtlas = new TexturePackerAtlas(this.assets.characterAtlas);
        const walkAnimation = new AtlasFrameAnimation(this.game,{
            frames: [
                texturePackerAtlas.getFrameByKey('character_step1'),
                texturePackerAtlas.getFrameByKey('character_step2'),
            ],
            isRepeating: true,
            name: 'walk',
            durationOfOneFrame: 200,
            duration: undefined!,
        });
        characterImage.addFrameAnimation(walkAnimation);
        walkAnimation.play();
        characterImage.appendTo(this);

    }
}
