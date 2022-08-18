import {Scene} from "@engine/scene/scene";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

export class MainScene extends Scene {

    @Resource.ResourceHolder() private assets:Assets;

    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS(`#130000`);

        const tileMap = new TileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
            exceptCollisionTiles: [],
            debug: false,
            restitution: 0.1,
        });
        tileMap.appendTo(this);

        const characterImage = new AnimatedImage(this.game,this.assets.characterTexture);
        characterImage.setRigidBody(this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(0,0,100,107),
            restitution:0.3,
        }));
        this.camera.followTo(characterImage);

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
