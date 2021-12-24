import {ITexture} from "@engine/renderer/common/texture";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {Game} from "@engine/core/game";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Rect} from "@engine/geometry/rect";
import {AbstractCharacter} from "../abstract/abstractCharacter";
import {Size} from "@engine/geometry/size";
import {Burster} from "../../misc/burster";
import {AbstractMonster} from "../abstract/abstractMonster";
import {Bullet} from "../../object/impl/bullet";
import {Sound} from "@engine/media/sound";
import {TestTube} from "../../object/impl/testTube";
import {BloodDrop} from "../../object/impl/bloodDrop";
import {Lava} from "../../object/impl/lava";
import {GameManager} from "../../../gameManager";
import {Virus} from "../../object/impl/virus";
import {Fan} from "../../object/impl/fan";

const LEFT:number = -1;
const RIGHT:number = 1;

export class Hero extends AbstractCharacter {

    constructor(game:Game, spr:ITexture) {
        super(game,spr,{
            restitution: 0.2,
            rect: new Rect(23,20,15,33),
            //debug: true,
            groupNames: [Hero.groupName, AbstractCharacter.groupName],
            ignoreCollisionWithGroupNames: [Fan.groupName],
        });
        Hero.instance = this;

        this.game.getCurrentScene().camera.followTo(this.renderableImage);
        this.velocity = 90;

        this.rotateAnimation.
            play().
            animationEventHandler.
            once(FRAME_ANIMATION_EVENTS.completed, e=>this.idleAnimation.play());

        this.listenKeys();
        this.listenCollisions();
        this.listenFallToHole();
    }

    public static override readonly groupName:string = 'hero';

    private static instance:Hero;

    private rotateAnimation:CellFrameAnimation;
    private fallAnimation:CellFrameAnimation;
    private highKickAnimation:CellFrameAnimation;

    private hurt:boolean = false;
    private hurtCnt:number = 0;
    private beating:boolean = false;
    private direction:number = RIGHT;

    private soundHurt:Sound;
    private soundShoot:Sound;
    private soundJump:Sound;
    private soundPick:Sound;

    public static getCreatedInstance():Hero {
        return Hero.instance;
    }

    public injectResources(
        res:
            {
                soundShoot:Sound,
                soundHurt:Sound,
                soundJump:Sound,
                soundPick:Sound
        }):void{
        this.soundShoot = res.soundShoot;
        this.soundHurt = res.soundHurt;
        this.soundJump = res.soundJump;
        this.soundPick = res.soundPick;
    }

    protected override onCreatedFrameAnimation(): void {
        this.idleAnimation = this.createFrameAnimation(
            'idle', [0,1,2,3],1000,
            new Size(16,16)
        );

        this.jumpAnimation = this.createFrameAnimation(
            'jump', this.createRange(32,39), 1000,
            new Size(16,16)
        );
        this.jumpAnimation.isRepeating = false;

        this.rotateAnimation = this.createFrameAnimation(
            'rotate', this.createRange(128,140), 1000,
            new Size(16,16)
        );
        this.rotateAnimation.isRepeating = false;


        this.fallAnimation = this.createFrameAnimation(
            'fall', this.createRange(80,86), 1000,
            new Size(16,16)
        );
        this.fallAnimation.isRepeating = false;

        this.walkAnimation = this.createFrameAnimation(
            'walk', this.createRange(16,23), 1000,
            new Size(16,16)
        );

        this.highKickAnimation = this.createFrameAnimation(
            'highKick', this.createRange(176,181), 200,
            new Size(16,16)
        );
        this.highKickAnimation.isRepeating = false;

    }

    private damage(val:number):void {
        if (this.hurt) return;
        this.blink();
        GameManager.getCreatedInstance().decrementPower(val,this.onLiveDecrementedOnDamage.bind(this));

    }

    private blink():void {
        this.hurt = true;
        this.beating = false;
        this.soundHurt.play();
        const tmr = this.getRenderableModel().setInterval(()=>{
            this.getRenderableModel().visible=!this.getRenderableModel().visible;
            this.hurtCnt++;
            if (this.hurtCnt===10) {
                this.hurtCnt = 0;
                this.hurt = false;
                this.getRenderableModel().visible = true;
                tmr.kill();
            }
        },200);
    }

    private onLiveDecrementedOnDamage():void {
        this.getRenderableModel().pos.y-=120;
        this.body.velocity.y = -100;
    }

    private shoot():void {
        const bullet:Bullet = Bullet.emit(this.game);
        bullet.getRenderableModel().pos.setXY(this.getRenderableModel().pos.x + 20,this.getRenderableModel().pos.y + 35);
        bullet.getRenderableModel().getRigidBody<ArcadeRigidBody>()!.velocity.x = 150 * this.direction;
        this.soundShoot.play();
    }

    private listenKeys():void {
        const jumpVelocity:number = 200;
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    if (!this.beating) this.goLeft();
                    this.direction = LEFT;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    if (!this.beating) this.goRight();
                    this.direction = RIGHT;
                    break;
                case KEYBOARD_KEY.SPACE:
                    if (this.renderableImage.getRigidBody<ArcadeRigidBody>()!.collisionFlags.bottom) {
                        this.jump(jumpVelocity);
                        this.soundJump.play();
                    }
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.idle();
                    break;
            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.Z:
                    this.beating = true;
                    this.highKickAnimation.play();
                    this.shoot();
                    this.highKickAnimation.animationEventHandler.once(FRAME_ANIMATION_EVENTS.completed, ev=>{
                        this.beating = false;
                        this.idle();
                    });
                    this.highKickAnimation.animationEventHandler.once(FRAME_ANIMATION_EVENTS.canceled, ev=>{
                        this.beating = false;
                        this.idle();
                    });
                    break;
            }
        });
    }

    private onCollidedWithMonster(monsterBody:ArcadeRigidBody):void {
        this.damage(20);
    }

    private listenCollisions():void {
        this.body.onCollidedWithGroup(AbstractMonster.groupName, e=>{
            this.onCollidedWithMonster(e);
        });
        this.body.onCollidedWithGroup(Burster.groupName,e=>{
            this.onCollidedWithMonster(e);
        });
        this.body.onCollidedWithGroup(Burster.groupName,e=>{
            this.onCollidedWithMonster(e);
        });
        this.body.onCollidedWithGroup(Lava.groupName,e=>{
            this.damage(30);
        });
        this.body.onCollidedWithGroup(Virus.groupName,e=>{
            this.damage(40);
            e.getHostModel().removeSelf();
        });
        this.body.onOverlappedWithGroup(Fan.groupName,e=>{
            this.body.velocity.y-=20;
        });
        this.body.onCollidedWithGroup(BloodDrop.groupName,e=>{
            this.soundPick.play();
            e.getHostModel().removeSelf();
            GameManager.getCreatedInstance().incrementNumOfLives();
        });
        this.body.onCollidedWithGroup(TestTube.groupName,e=>{
            this.soundPick.play();
            //GameManager.getCreatedInstance().incrementPower();
            GameManager.getCreatedInstance().onObjectPicked();
            e.getHostModel().removeSelf();
        });
    }

    private listenFallToHole():void {
        this.getRenderableModel().setInterval(()=>{
            if (this.getRenderableModel().pos.y>this.game.getCurrentScene().size.height + 1000) {
                this.damage(100);
                this.getRenderableModel().pos.x = 100;
                this.getRenderableModel().pos.y = 100;
                this.body.velocity.setXY(0,0);
                this.body.acceleration.setXY(0,0);
            }
        },1000);
    }

}
