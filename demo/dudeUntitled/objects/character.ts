import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScroll/arcadeSideScrollControl";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {CharacterBullet} from "./characterBullet";
import {DiContainer, Injectable} from "../ioc";
import {MainScene} from "../mainScene";
import {GroundDust} from "../particles/groundDust";
import Inject = DiContainer.Inject;
import {Script} from "./script";
import {Key} from "./key";

export class Character implements Injectable {

    private readonly characterImage:AnimatedImage;
    private body:ArcadeRigidBody;

    @Inject(GroundDust.name) public readonly groundDust:GroundDust;
    @Inject(TileMap.name) private readonly tileMap:TileMap;
    @Inject(Script.name) private readonly script:Script;

    constructor(private scene:MainScene, tiledObject:ITiledJSON['layers'][0]['objects'][0]) {
        const characterImage = new AnimatedImage(scene.getGame(),scene.assets.characterTexture);
        this.characterImage = characterImage;
        characterImage.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        characterImage.setRigidBody(scene.getGame().getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(4,2,30,41),
            restitution:0.3,
            groupNames:['character'],
        }));

        characterImage.appendTo(scene);
        scene.camera.followTo(characterImage);

    }

    public postConstruct(): void {
        this.initBh();
        this.initCollisions();
    }


    private initBh():void {
        const texturePackerAtlas = new TexturePackerAtlas(this.scene.assets.characterAtlas);
        const body = this.characterImage.getRigidBody<ArcadeRigidBody>();
        this.body = body;
        const bh = new ArcadeSideScrollControl(this.scene.getGame(),{
            velocity: 100,
            jumpVelocity: 200,
            verticalLadderTileIds: [3,7],
            horizontalLadderTileIds: [4],
            waterTileIds: [1,2],
            tileMap: this.tileMap,
            runAnimation: new AtlasFrameAnimation(this.scene.getGame(),{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_step1'),
                    texturePackerAtlas.getFrameByKey('character_step2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            idleAnimation: new AtlasFrameAnimation(this.scene.getGame(),{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_stand1'),
                    texturePackerAtlas.getFrameByKey('character_stand2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 2000,
            }),
            jumpAnimation: new AtlasFrameAnimation(this.scene.getGame(),{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_jump1'),
                    texturePackerAtlas.getFrameByKey('character_jump2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            fireAnimation: new AtlasFrameAnimation(this.scene.getGame(),{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_fire1'),
                    texturePackerAtlas.getFrameByKey('character_fire2'),
                ],
                isRepeating: false,
                durationOfOneFrame: 100,
            }),
            climbVerticalAnimation: new AtlasFrameAnimation(this.scene.getGame(),{
                frames: [
                    texturePackerAtlas.getFrameByKey('character_climb_vertical1'),
                    texturePackerAtlas.getFrameByKey('character_climb_vertical2'),
                ],
                isRepeating: true,
                durationOfOneFrame: 200,
            }),
            climbHorizontalAnimation: new AtlasFrameAnimation(this.scene.getGame(),{
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
            },
            onJumped:()=>{
                this.groundDust.emit(body.getMidX(),body.getBottom());
            }
        });
        const characterImage = this.characterImage;
        characterImage.addBehaviour(bh);

        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.CONTROL, e=>{
            bh.fire();
            const bullet = new CharacterBullet(this.scene.getGame());
            bullet.getContainer().getRigidBody().velocity.x = 300*characterImage.scale.x;
            bullet.getContainer().pos.setXY(
                characterImage.pos.x + characterImage.size.width  / 2 + (characterImage.size.width/2)*characterImage.scale.x,
                characterImage.pos.y + characterImage.size.height / 2
            );
            bullet.getContainer().appendTo(this.scene.getLayerAtIndex(0));
        });
    }

    private initCollisions():void {
        this.body.onOverlappedWithGroup('collectable',e =>{
            e.getHostModel().removeSelf();
            const host = e.addInfo.host;
            const hostType = host?.type;
            switch (hostType) {
                case 'Key':
                    this.script.onHeroCollidedWithKey(host as Key).catch(console.error);
                    break;
            }
        });
    }

}
