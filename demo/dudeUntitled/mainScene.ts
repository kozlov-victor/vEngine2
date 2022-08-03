import {Scene} from "@engine/scene/scene";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";

export class MainScene extends Scene {

    @Resource.ResourceHolder() private assets:Assets;

    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS(`#940202`);

        const tileMap:TileMap = new TileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
        });
        tileMap.appendTo(this);

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
        });
        characterImage.addFrameAnimation(walkAnimation);
        walkAnimation.play();
        characterImage.appendTo(this);

    }
}
