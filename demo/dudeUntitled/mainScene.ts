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
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScrollControl";

export class MainScene extends Scene {

    @Resource.ResourceHolder() private assets:Assets;

    public override onReady():void {
        document.body.style.backgroundColor = 'black';

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
        characterImage.pos.setXY(100,100); // todo
        characterImage.setRigidBody(this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(0,0,36,39),
            restitution:0.3,
        }));
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

        const idleAnimation = new AtlasFrameAnimation(this.game,{
            frames: [
                texturePackerAtlas.getFrameByKey('character_stand'),
            ],
            isRepeating: true,
            name: 'idle',
            durationOfOneFrame: 200,
        });
        characterImage.addFrameAnimation(idleAnimation);

        characterImage.addBehaviour(new ArcadeSideScrollControl(this.game,{
            velocity: 100,
            jumpVelocity: 300,
            runAnimation: 'walk',
            idleAnimation: 'idle',
        }));

        this.camera.followTo(characterImage);

        characterImage.appendTo(this);


    }
}
