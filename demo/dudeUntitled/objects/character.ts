import {Scene} from "@engine/scene/scene";
import {Assets} from "../assets/assets";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScrollControl";
import {Game} from "@engine/core/game";

export class Character {
    constructor(game: Game, scene:Scene, assets:Assets) {
        const characterImage = new AnimatedImage(game,assets.characterTexture);
        characterImage.pos.setXY(100,100); // todo
        characterImage.setRigidBody(game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(4,2,30,41),
            restitution:0.3,
        }));
        const texturePackerAtlas = new TexturePackerAtlas(assets.characterAtlas);

        const walkAnimation = new AtlasFrameAnimation(game,{
            frames: [
                texturePackerAtlas.getFrameByKey('character_step1'),
                texturePackerAtlas.getFrameByKey('character_step2'),
            ],
            isRepeating: true,
            name: 'walk',
            durationOfOneFrame: 200,
        });
        characterImage.addFrameAnimation(walkAnimation);

        const idleAnimation = new AtlasFrameAnimation(game,{
            frames: [
                texturePackerAtlas.getFrameByKey('character_stand1'),
                texturePackerAtlas.getFrameByKey('character_stand2'),
            ],
            isRepeating: true,
            name: 'idle',
            durationOfOneFrame: 2000,
        });
        characterImage.addFrameAnimation(idleAnimation);

        const jumpAnimation = new AtlasFrameAnimation(game,{
            frames: [
                texturePackerAtlas.getFrameByKey('character_jump1'),
                texturePackerAtlas.getFrameByKey('character_jump2'),
            ],
            isRepeating: true,
            name: 'jump',
            durationOfOneFrame: 200,
        });
        characterImage.addFrameAnimation(jumpAnimation);

        characterImage.addBehaviour(new ArcadeSideScrollControl(game,{
            velocity: 100,
            jumpVelocity: 300,
            runAnimation: 'walk',
            idleAnimation: 'idle',
            jumpAnimation: 'jump',
        }));

        characterImage.appendTo(scene);
        scene.camera.followTo(characterImage);
    }
}
