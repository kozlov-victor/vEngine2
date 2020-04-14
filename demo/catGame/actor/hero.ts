import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {Game} from "@engine/core/game";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ARCADE_COLLISION_EVENT, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Rect} from "@engine/geometry/rect";
import {AbstractCharacter} from "./abstract/abstract";
import {Size} from "@engine/geometry/size";
import {Monster1} from "./monster1";
import {Burster} from "./burster";

export class Hero extends AbstractCharacter {

    public static readonly groupName:string = 'Hero';

    public static getCreatedInstance():Hero {
        return Hero.instance;
    }

    private static instance:Hero;

    private idleAnimation:CellFrameAnimation;
    private jumpAnimation:CellFrameAnimation;
    private rotateAnimation:CellFrameAnimation;
    private fallAnimation:CellFrameAnimation;
    private walkAnimation:CellFrameAnimation;
    private highKickAnimation:CellFrameAnimation;
    private downKickAnimation:CellFrameAnimation;

    private rigidBody:ArcadeRigidBody;
    private hurt:boolean = false;
    private hurtCnt:number = 0;
    private beating:boolean = false;

    constructor(protected game:Game, spr:ResourceLink<ITexture>) {
        super(game,spr);
        Hero.instance = this;

        this.idleAnimation = this.createFrameAnimation(
            'idle', [0,1,2,3],1000,
            new Size(16,16)
        );

        this.jumpAnimation = this.createFrameAnimation(
            'jump', [32,33,34,35,36,37,38,39], 1000,
            new Size(16,16)
        );
        this.jumpAnimation.isRepeating = false;

        this.rotateAnimation = this.createFrameAnimation(
            'rotate', [128,129,130,131,132,133,134,135,136,137,138,139,140], 1000,
            new Size(16,16)
        );
        this.rotateAnimation.isRepeating = false;


        this.fallAnimation = this.createFrameAnimation(
            'fall', [80,81,82,83,84,85,86], 1000,
            new Size(16,16)
        );
        this.fallAnimation.isRepeating = false;

        this.walkAnimation = this.createFrameAnimation(
            'walk', [16,17,18,19,20,21,22,23], 1000,
            new Size(16,16)
        );

        this.highKickAnimation = this.createFrameAnimation(
            'highKick', [176,177,178,179,180,181], 1000,
            new Size(16,16)
        );
        this.highKickAnimation.isRepeating = false;

        this.downKickAnimation = this.createFrameAnimation(
            'downKick', [192,193,194,195,196,197,198,199], 1000,
            new Size(16,16)
        );
        this.downKickAnimation.isRepeating = false;

        this.game.camera.followTo(this.renderableImage);
        this.rigidBody = this.createRigidBody({
            restitution: 0.2,
            rect: new Rect(23,20,15,33),
            //debug: true,
            groupNames: [Hero.groupName],
            //ignoreCollisionWithGroupNames: [Burster.groupName],
        });
        this.appendToScene();

        this.rotateAnimation.
            play().
            once(FRAME_ANIMATION_EVENTS.completed, e=>this.idleAnimation.play());
        this.renderableImage.pos.x = 100;
        this.listenKeys();
        this.listenCollisions();
    }

    private damage():void {
        this.hurt = true;
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

    private listenKeys():void {
        const velocity:number = 90;
        const jumpVelocity:number = 200;
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.Z:
                    this.beating = true;
                    this.highKickAnimation.play().once(FRAME_ANIMATION_EVENTS.completed, ev=>{
                        this.beating = false;
                        this.idleAnimation.play();
                    });
                    break;
                case KEYBOARD_KEY.X:
                    this.beating = true;
                    this.downKickAnimation.play().once(FRAME_ANIMATION_EVENTS.completed, ev=>{
                        this.beating = false;
                        this.idleAnimation.play();
                    });
                    break;
                case KEYBOARD_KEY.LEFT:
                    this.renderableImage.getRigidBody()!.velocity.x = -velocity;
                    this.renderableImage.scale.x = -1;
                    this.renderableImage.anchorPoint.x = 3;
                    if (this.rigidBody.collisionFlags.bottom && !this.beating) this.walkAnimation.play();
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.renderableImage.getRigidBody()!.velocity.x = velocity;
                    this.renderableImage.scale.x = 1;
                    this.renderableImage.anchorPoint.x = 0;
                    if (this.rigidBody.collisionFlags.bottom && !this.beating) this.walkAnimation.play();
                    break;
                case KEYBOARD_KEY.SPACE:
                    if (this.renderableImage.getRigidBody<ArcadeRigidBody>()!.collisionFlags.bottom) {
                        this.renderableImage.getRigidBody()!.velocity.y = -jumpVelocity;
                        this.jumpAnimation.play().once(FRAME_ANIMATION_EVENTS.completed, ev=>this.idleAnimation.play());
                    }
                    break;

            }
        });
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.renderableImage.getRigidBody()!.velocity.x = 0;
                    this.idleAnimation.play();
                    break;
            }
        });
    }

    private onCollidedWithMonster(monsterBody:ArcadeRigidBody):void {
        if (!this.hurt) this.damage();
    }

    private listenCollisions():void {
        this.rigidBody.on(ARCADE_COLLISION_EVENT.OVERLAPPED, e=>{
            if (e.groupNames.indexOf(Monster1.groupName)>-1) {
                this.onCollidedWithMonster(e);
            }
        });
    }

}
