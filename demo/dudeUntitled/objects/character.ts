import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_COLLISION_EVENTS, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScroll/arcadeSideScrollControl";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MainScene} from "../mainScene";
import {GroundDustEmitter} from "../particles/groundDustEmitter";
import {Script} from "./script";
import {Key} from "./key";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";
import {Sausage} from "./sausage";
import {Candy} from "./candy";
import {Fire} from "./fire";
import {FirePowerup} from "./firePowerup";
import {DI} from "@engine/core/ioc";

const JUMP_VEL = 200;

@DI.Injectable()
export class Character {

    public static NAME = 'Character';

    public readonly image:AnimatedImage;
    public body:ArcadeRigidBody;

    private blinking = false;

    @DI.Inject(GroundDustEmitter) private readonly groundDust:GroundDustEmitter;
    @DI.Inject(AnimatedTileMap) private readonly tileMap:AnimatedTileMap;
    @DI.Inject(Script) private script:Script;

    public bh:ArcadeSideScrollControl;
    public firePower:0|1|2|3 = 0;

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

        this.body = this.image.getRigidBody<ArcadeRigidBody>();

        characterImage.appendTo(scene);
        scene.camera.followTo(characterImage);

        this.initBh();
        this.listenToKeys();
        this.initCollisions();

    }

    //@DI.PostConstruct()
    public postConstruct(): void {

    }


    private initBh():void {
        const texturePackerAtlas = new TexturePackerAtlas(this.scene.assets.spritesAtlas);
        this.bh = new ArcadeSideScrollControl(this.scene.getGame(),{
            velocity: 100,
            jumpVelocity: JUMP_VEL,
            verticalLadderTileIds: [3,7],
            horizontalLadderTileIds: [4],
            waterTileIds: [1,2,12,13],
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
                if(this.body.velocity.y<-30) {
                    this.groundDust.emit(this.body.getMidX(),this.body.getBottom());
                }
            },
            onJumped:()=>{
                this.groundDust.emit(this.body.getMidX(),this.body.getBottom());
            }
        });
        this.image.addBehaviour(this.bh);

    }

    private listenToKeys() {
        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.CONTROL, e=>{
            this.bh.fire();
            this.script.heroWillShoot(this);
        });
    }

    private acceptDamage():boolean {
        if (this.blinking) return false;
        this.blinking = true;
        const blinkInterval = this.image.setInterval(()=>{
            this.image.visible=!this.image.visible;
        },150);
        this.image.setTimeout(()=>{
            blinkInterval.kill();
            this.image.visible = true;
            this.blinking = false;
        },3000);
        return true;
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
                case FirePowerup.name:
                    this.script.onHeroCollidedWithFirePowerup(this);
                    break;
            }
        });
        this.body.onOverlappedWithGroup('damageable',e =>{
            if (this.acceptDamage()) return;
            const host = e.addInfo.host;
            const hostType = host.constructor.name;
            switch (hostType) {
                case Fire.name:
                    this.script.onHeroCollidedWithFire(this);
                    break;
            }
        });
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENTS.OVERLAPPED, e=>{
            if ([12,13].includes(e.addInfo.tileId)) this.acceptDamage();
        });
    }

}
