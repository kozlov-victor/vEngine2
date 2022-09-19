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
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {CharacterBullet} from "./characterBullet";

export class Character {

    constructor(game: Game, scene:Scene, tileMap:TileMap, assets:Assets,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {
        const characterImage = new AnimatedImage(game,assets.characterTexture);
        characterImage.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        characterImage.setRigidBody(game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(4,2,30,41),
            restitution:0.3,
            groupNames:['character'],
        }));
        const texturePackerAtlas = new TexturePackerAtlas(assets.characterAtlas);

        const bh = new ArcadeSideScrollControl(game,{
            velocity: 100,
            jumpVelocity: 300,
            ladderTileIds: [3],
            tileMap,
            runAnimation: new AtlasFrameAnimation(game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_step1'),
                    texturePackerAtlas.getFrameByKey('character_step2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            idleAnimation: new AtlasFrameAnimation(game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_stand1'),
                    texturePackerAtlas.getFrameByKey('character_stand2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 2000,
            }),
            jumpAnimation: new AtlasFrameAnimation(game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_jump1'),
                    texturePackerAtlas.getFrameByKey('character_jump2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            fireAnimation: new AtlasFrameAnimation(game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_fire1'),
                    texturePackerAtlas.getFrameByKey('character_fire2'),
                ],
                isRepeating: false,
                durationOfOneFrame: 100,
            }),
            climbAnimation: new AtlasFrameAnimation(game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_climb1'),
                    texturePackerAtlas.getFrameByKey('character_climb2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
        });
        characterImage.addBehaviour(bh);

        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.CONTROL, e=>{
            bh.fire();
            const bullet = new CharacterBullet(game);
            bullet.getContainer().getRigidBody().velocity.x = 300*characterImage.scale.x;
            bullet.getContainer().pos.setXY(
                characterImage.pos.x + characterImage.size.width  / 2 + (characterImage.size.width/2)*characterImage.scale.x,
                characterImage.pos.y + characterImage.size.height / 2
            );
            bullet.getContainer().appendTo(scene);
        });

        characterImage.appendTo(scene);
        scene.camera.followTo(characterImage);
    }
}
