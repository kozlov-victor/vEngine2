import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScroll/arcadeSideScrollControl";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {CharacterBullet} from "./characterBullet";
import {DiContainer, Injectable} from "../ioc";
import {MainScene} from "../mainScene";
import {GroundDustEmitter} from "../particles/groundDustEmitter";
import {Script} from "./script";
import {Key} from "./key";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";
import {Sausage} from "./sausage";
import {Candy} from "./candy";
import Inject = DiContainer.Inject;
import {Fire} from "./fire";

const JUMP_VEL = 200;

export class Character implements Injectable {

    private readonly image:AnimatedImage;
    private body:ArcadeRigidBody;

    private blinking = false;

    @Inject(GroundDustEmitter) private readonly groundDust:GroundDustEmitter;
    @Inject(AnimatedTileMap) private readonly tileMap:AnimatedTileMap;
    @Inject(Script) private script:Script;

    private bh:ArcadeSideScrollControl;

    constructor(private scene:MainScene, tiledObject:ITiledJSON['layers'][0]['objects'][0]) {
        const characterImage = new AnimatedImage(scene.getGame(),scene.assets.spritesTexture);
        this.image = characterImage;
        characterImage.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        characterImage.setRigidBody(scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: false,
            rect: new Rect(4,2,30,41),
            restitution:0.3,
            groupNames:['character'],
            ignoreOverlapWithGroupNames: ['bump'],
        }));

        characterImage.appendTo(scene);
        scene.camera.followTo(characterImage);

    }

    public postConstruct(): void {
        this.initBh();
        this.initCollisions();
    }

    public acceptDamage() {

    }


    private initBh():void {
        const texturePackerAtlas = new TexturePackerAtlas(this.scene.assets.spritesAtlas);
        const body = this.image.getRigidBody<ArcadeRigidBody>();
        this.body = body;
        this.bh = new ArcadeSideScrollControl(this.scene.getGame(),{
            velocity: 100,
            jumpVelocity: JUMP_VEL,
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
        const characterImage = this.image;
        characterImage.addBehaviour(this.bh);

        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.CONTROL, e=>{
            this.bh.fire();
            const bullet = new CharacterBullet(this.scene.getGame());
            bullet.getContainer().getRigidBody().velocity.x = 300*characterImage.scale.x;
            bullet.getContainer().pos.setXY(
                characterImage.pos.x + characterImage.size.width  / 2 + (characterImage.size.width/2)*characterImage.scale.x,
                characterImage.pos.y + characterImage.size.height / 2
            );
            bullet.getContainer().appendTo(this.scene.getLayerAtIndex(0));
        });

        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.DIGIT_1, e=>{
            this.bh.setFireAnimation(
                new AtlasFrameAnimation(this.scene.getGame(),{
                    frames: [
                        texturePackerAtlas.getFrameByKey('character_shoot1'),
                        texturePackerAtlas.getFrameByKey('character_shoot2'),
                    ],
                    isRepeating: false,
                    durationOfOneFrame: 200,
                })
            )
        });
        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.DIGIT_2, e=>{
            this.bh.setFireAnimation(
                new AtlasFrameAnimation(this.scene.getGame(),{
                    frames: [
                        texturePackerAtlas.getFrameByKey('character_gun1'),
                        texturePackerAtlas.getFrameByKey('character_gun2'),
                    ],
                    isRepeating: false,
                    durationOfOneFrame: 200,
                })
            )
        });
    }

    private initCollisions():void {
        this.body.onOverlappedWithGroup('collectable',e =>{
            e.getHostModel().removeSelf();
            const host = e.addInfo.host;
            const hostType = host.constructor.name;
            switch (hostType) {
                case Key.name:
                    this.script.onHeroCollidedWithKey(host as Key).catch(console.error);
                    break;
                case Sausage.name:
                    this.script.onHeroCollectedSausage(host as Sausage);
                    break;
                case Candy.name:
                    this.script.onHeroCollectedCandy(host as Candy);
                    break;
            }
        });
        this.body.onOverlappedWithGroup('damageable',e =>{
            const host = e.addInfo.host;
            const hostType = host.constructor.name;
            switch (hostType) {
                case Fire.name:
                    if (!this.blinking) {
                        this.blinking = true;
                        const blinkInterval = this.image.setInterval(()=>{
                            this.image.visible=!this.image.visible;
                        },150);
                        this.image.setTimeout(()=>{
                            blinkInterval.kill();
                            this.image.visible = true;
                            this.blinking = false;
                        },3000);
                        this.script.onHeroCollidedWithFile(this);
                    }
                    break;
            }
        });
    }

}
