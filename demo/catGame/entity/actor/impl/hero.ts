import {ResourceLink} from "@engine/resources/resourceLink";
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
import {CollectableEntity} from "../../object/abstract/collectableEntity";
import {Sound} from "@engine/media/sound";

const LEFT:number = -1;
const RIGHT:number = 1;

export class Hero extends AbstractCharacter {

    public static readonly groupName:string = 'hero';

    public static getCreatedInstance():Hero {
        return Hero.instance;
    }

    private static instance:Hero;

    private rotateAnimation:CellFrameAnimation;
    private fallAnimation:CellFrameAnimation;
    private highKickAnimation:CellFrameAnimation;

    private hurt:boolean = false;
    private hurtCnt:number = 0;
    private beating:boolean = false;
    private direction:number = RIGHT;

    private soundHurt = new Sound(this.game);
    private soundShoot = new Sound(this.game);
    private soundJump = new Sound(this.game);
    private soundPick = new Sound(this.game);

    constructor(protected game:Game, spr:ResourceLink<ITexture>) {
        super(game,spr,{
            restitution: 0.2,
            rect: new Rect(23,20,15,33),
            //debug: true,
            groupNames: [Hero.groupName, AbstractCharacter.groupName],
            //ignoreCollisionWithGroupNames: [Burster.groupName],
        });
        Hero.instance = this;

        this.game.camera.followTo(this.renderableImage);
        this.velocity = 90;

        this.rotateAnimation.
            play().
            once(FRAME_ANIMATION_EVENTS.completed, e=>this.idleAnimation.play());

        this.listenKeys();
        this.listenCollisions();
    }

    public injectResources(
        res:
            {
                soundShoot:ResourceLink<void>,
                soundHurt:ResourceLink<void>,
                soundJump:ResourceLink<void>,
                soundPick:ResourceLink<void>
        }){
        this.soundShoot.setResourceLink(res.soundShoot);
        this.soundHurt.setResourceLink(res.soundHurt);
        this.soundJump.setResourceLink(res.soundJump);
        this.soundPick.setResourceLink(res.soundPick);
    }

    protected onCreatedFrameAnimation(): void {
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

    private damage():void {
        if (this.hurt) return;
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

    private shoot():void {
        const bullet:Bullet = Bullet.emit(this.game);
        bullet.getRenderableModel().pos.setXY(this.getRenderableModel().pos.x + 20,this.getRenderableModel().pos.y + 35);
        bullet.getRenderableModel().getRigidBody<ArcadeRigidBody>()!.velocity.x = 150 * this.direction;
        this.soundShoot.play();
    }

    private listenKeys():void {
        const jumpVelocity:number = 200;
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.key) {
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
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.idle();
                    break;
            }
        });
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.Z:
                    this.beating = true;
                    this.highKickAnimation.play();
                    this.shoot();
                    this.highKickAnimation.once(FRAME_ANIMATION_EVENTS.completed, ev=>{
                        this.beating = false;
                        this.idle();
                    });
                    this.highKickAnimation.once(FRAME_ANIMATION_EVENTS.canceled, ev=>{
                        this.beating = false;
                        this.idle();
                    });
                    break;
            }
        });
    }

    private onCollidedWithMonster(monsterBody:ArcadeRigidBody):void {
        this.damage();
    }

    private listenCollisions():void {
        this.body.onCollidedWithGroup(AbstractMonster.groupName, e=>{
            this.onCollidedWithMonster(e);
        });
        this.body.onCollidedWithGroup(Burster.groupName,e=>{
            this.onCollidedWithMonster(e);
        });
        this.body.onCollidedWithGroup(CollectableEntity.groupName,e=>{
            this.soundPick.play();
            e.getHostModel().removeSelf();
        });
    }

}
