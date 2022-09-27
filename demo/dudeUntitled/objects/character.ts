import {Scene} from "@engine/scene/scene";
import {Assets} from "../assets/assets";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScrollControl";
import {Game} from "@engine/core/game";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {CharacterBullet} from "./characterBullet";
import {GroundDust} from "../particles/groundDust";

export class Character {

    private readonly characterImage:AnimatedImage;
    private readonly groundDust = new GroundDust(this.game, this.scene);

    constructor(private game: Game, private scene:Scene, private tileMap:TileMap, private assets:Assets,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {
        const characterImage = new AnimatedImage(game,assets.characterTexture);
        this.characterImage = characterImage;
        characterImage.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        characterImage.setRigidBody(game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(4,2,30,41),
            restitution:0.3,
            groupNames:['character'],
        }));

        characterImage.appendTo(scene);
        scene.camera.followTo(characterImage);

        this.initBh();

    }

    private initBh():void {
        const texturePackerAtlas = new TexturePackerAtlas(this.assets.characterAtlas);
        const body = this.characterImage.getRigidBody<ArcadeRigidBody>();
        const bh = new ArcadeSideScrollControl(this.game,{
            velocity: 100,
            jumpVelocity: 200,
            verticalLadderTileIds: [3],
            horizontalLadderTileIds: [4],
            tileMap: this.tileMap,
            runAnimation: new AtlasFrameAnimation(this.game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_step1'),
                    texturePackerAtlas.getFrameByKey('character_step2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            idleAnimation: new AtlasFrameAnimation(this.game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_stand1'),
                    texturePackerAtlas.getFrameByKey('character_stand2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 2000,
            }),
            jumpAnimation: new AtlasFrameAnimation(this.game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_jump1'),
                    texturePackerAtlas.getFrameByKey('character_jump2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            fireAnimation: new AtlasFrameAnimation(this.game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_fire1'),
                    texturePackerAtlas.getFrameByKey('character_fire2'),
                ],
                isRepeating: false,
                durationOfOneFrame: 100,
            }),
            climbVerticalAnimation: new AtlasFrameAnimation(this.game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_climb_vertical1'),
                    texturePackerAtlas.getFrameByKey('character_climb_vertical2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            climbHorizontalAnimation: new AtlasFrameAnimation(this.game,{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_climb_horizontal1'),
                    texturePackerAtlas.getFrameByKey('character_climb_horizontal2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            onLanded:()=>{
                if(body.velocity.y<-30) {
                    this.groundDust.emit(body.getMidX(),body.getBottom());
                }
            }
        });
        const characterImage = this.characterImage;
        characterImage.addBehaviour(bh);

        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.CONTROL, e=>{
            bh.fire();
            const bullet = new CharacterBullet(this.game);
            bullet.getContainer().getRigidBody().velocity.x = 300*characterImage.scale.x;
            bullet.getContainer().pos.setXY(
                characterImage.pos.x + characterImage.size.width  / 2 + (characterImage.size.width/2)*characterImage.scale.x,
                characterImage.pos.y + characterImage.size.height / 2
            );
            bullet.getContainer().appendTo(this.scene);
        });
    }

}
