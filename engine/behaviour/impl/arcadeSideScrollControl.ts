import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {ARCADE_COLLISION_EVENT, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Game} from "@engine/core/game";
import {IKeyVal} from "@engine/misc/object";
import {DebugError} from "@engine/debug/debugError";
import {
    AbstractFrameAnimation,
    FRAME_ANIMATION_EVENTS
} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {IRectJSON} from "@engine/geometry/rect";

interface IParams extends IKeyVal<any>{
    velocity: number;
    jumpVelocity: number;
    runAnimation: AbstractFrameAnimation<IRectJSON>;
    idleAnimation: AbstractFrameAnimation<IRectJSON>;
    jumpAnimation?: AbstractFrameAnimation<IRectJSON>;
    fireAnimation?:AbstractFrameAnimation<IRectJSON>;
}

export class ArcadeSideScrollControl extends BaseAbstractBehaviour{

    protected declare parameters: IParams;
    private gameObject:AnimatedImage;
    private body:ArcadeRigidBody;
    private onGround = false;
    private onLadder = false;
    private isFiring = false;
    private isClimbing = false;

    constructor(game: Game, parameters: IParams) {
        super(game, parameters);
    }

    public clone(): this {
        return undefined!;
    }

    public manage(gameObject: AnimatedImage): void {

        if (DEBUG && this.gameObject) {
            throw new DebugError(`this behaviour instance is already applied`);
        }
        this.gameObject = gameObject;

        this.init();
        this.listenToCollisions();
        this.listenToKeys();

    }

    public goLeft():void {
        this.body.velocity.x = -this.parameters.velocity;
        this.gameObject.scale.x = -Math.abs(this.gameObject.scale.x);
        this.doGroundAnimation();
    }

    public goRight():void {
        this.body.velocity.x = this.parameters.velocity;
        this.gameObject.scale.x = Math.abs(this.gameObject.scale.x);
        this.doGroundAnimation();
    }

    public climbLadderUp():void {
        if (this.onLadder) {
            this.isClimbing = true;
            this.body.velocity.y = -this.parameters.velocity;
            this.body.gravityImpact = 0;
        }
    }

    public climbLadderDown():void {
        if (this.onGround) return;
        if (this.onLadder) {
            this.isClimbing = true;
            this.body.velocity.y = this.parameters.velocity;
            this.body.gravityImpact = 0;
        }
    }

    public stopClimbing(): void {
        this.body.velocity.y = 0;
    }

    public stop():void {
        this.body.velocity.x = this.parameters.velocity;
        this.body.velocity.x = 0;
        if (this.onGround) this.gameObject.playFrameAnimation(this.parameters.idleAnimation);
    }

    public fire():void {
        if (this.parameters.fireAnimation) {
            this.isFiring = true;
            const an = this.gameObject.playFrameAnimation(this.parameters.fireAnimation);
            an.animationEventHandler.once(FRAME_ANIMATION_EVENTS.completed, ()=>{
                this.isFiring = false;
                this.doGroundAnimation();
            });
            an.animationEventHandler.once(FRAME_ANIMATION_EVENTS.canceled, ()=>{
                this.isFiring = false;
                this.doGroundAnimation();
            });

        }
    }

    public jump():void {
        if (this.gameObject.getRigidBody<ArcadeRigidBody>().collisionFlags.bottom) {
            this.body.velocity.y -= this.parameters.jumpVelocity;
            if (this.parameters.jumpAnimation) {
                this.gameObject.playFrameAnimation(this.parameters.jumpAnimation);
            }
        }
    }

    public override update() {
        super.update();
        const body = this.gameObject.getRigidBody<ArcadeRigidBody>()
        this.onGround = body.collisionFlags.bottom;
        this.onLadder = body.overlappedWith?.addInfo?.tileId===3;
        if (!this.onLadder) {
            body.gravityImpact = 1;
            this.isClimbing = false;
        }
        if (!this.onGround && this.gameObject.getCurrentFrameAnimationName()!==this.parameters.jumpAnimation) {
            if (this.parameters.jumpAnimation!==undefined && !this.isFiring) {
                this.gameObject.playFrameAnimation(this.parameters.jumpAnimation);
            }
        }
    }

    private init():void {
        this.gameObject.addFrameAnimation(this.parameters.runAnimation);
        this.gameObject.addFrameAnimation(this.parameters.idleAnimation);
        if (this.parameters.jumpAnimation) this.gameObject.addFrameAnimation(this.parameters.jumpAnimation);
        if (this.parameters.fireAnimation) this.gameObject.addFrameAnimation(this.parameters.fireAnimation);

        this.gameObject.transformPoint.setToCenter();
        this.gameObject.playFrameAnimation(this.parameters.idleAnimation);

        const body = this.gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (DEBUG && body===undefined) {
            throw new DebugError(`cannot apply behaviour: ${this.constructor.name}, rigid body is not set`);
        }
        this.body = body;
    }

    private listenToCollisions():void {
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, _=>{
            this.body.gravityImpact = 1;
            this.body.velocity.y = 0;
            this.doGroundAnimation();
        });
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.OVERLAPPED, _=>{
            this.body.gravityImpact = 0;
            if (!this.isClimbing) this.body.velocity.y = 0;
        });
    }

    private listenToKeys():void {
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    this.goLeft();
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.goRight();
                    break;
                case KEYBOARD_KEY.UP:
                    this.climbLadderUp();
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.climbLadderDown();
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.SPACE:
                    this.jump();
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.stop();
                    break;
                case KEYBOARD_KEY.UP:
                case KEYBOARD_KEY.DOWN:
                    this.stopClimbing();
                    break;
                default:
                    break;
            }
        });
    }

    private doGroundAnimation():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        const params = this.parameters;
        if (this.onGround && !this.isFiring) {
            if (body.velocity.x) {
                gameObject.playFrameAnimation(params.runAnimation);
            }
            else {
                gameObject.playFrameAnimation(params.idleAnimation);
            }
        }
    }

}
