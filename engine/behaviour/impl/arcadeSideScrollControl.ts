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
    private onGround = false;
    private onLadder = false;
    private isFire = false;

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

        const parameters = this.parameters;
        gameObject.addFrameAnimation(parameters.runAnimation);
        gameObject.addFrameAnimation(parameters.idleAnimation);
        if (parameters.jumpAnimation) gameObject.addFrameAnimation(parameters.jumpAnimation);
        if (parameters.fireAnimation) gameObject.addFrameAnimation(parameters.fireAnimation);

        this.gameObject = gameObject;
        gameObject.transformPoint.setToCenter();
        gameObject.playFrameAnimation(parameters.idleAnimation);

        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (DEBUG && body===undefined) {
            throw new DebugError(`cannot apply behaviour: ${this.constructor.name}, rigid body is not set`);
        }

        body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, _=>{
            body.gravityImpact = 1;
            this.doGroundAnimation();
        });

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

    public goLeft():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        body.velocity.x = -this.parameters.velocity;
        gameObject.scale.x = -Math.abs(gameObject.scale.x);
        this.doGroundAnimation();
    }

    public goRight():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        body.velocity.x = this.parameters.velocity;
        gameObject.scale.x = Math.abs(gameObject.scale.x);
        this.doGroundAnimation();
    }

    public climbLadderUp():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (this.onLadder) {
            body.velocity.y = -this.parameters.velocity;
            body.gravityImpact = 0;
        }
    }

    public climbLadderDown():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (this.onGround) return;
        if (this.onLadder) {
            body.velocity.y = this.parameters.velocity;
            body.gravityImpact = 0;
        }
    }

    public stopClimbing(): void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        body.velocity.y = 0;
    }

    public stop():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        body.velocity.x = this.parameters.velocity;
        body.velocity.x = 0;
        if (this.onGround) gameObject.playFrameAnimation(this.parameters.idleAnimation);
    }

    public fire():void {
        if (this.parameters.fireAnimation) {
            this.isFire = true;
            const an = this.gameObject.playFrameAnimation(this.parameters.fireAnimation);
            an.animationEventHandler.once(FRAME_ANIMATION_EVENTS.completed, ()=>{
                this.isFire = false;
                this.doGroundAnimation();
            });
            an.animationEventHandler.once(FRAME_ANIMATION_EVENTS.canceled, ()=>{
                this.isFire = false;
                this.doGroundAnimation();
            });

        }
    }

    public jump():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        const parameters = this.parameters;
        if (this.gameObject.getRigidBody<ArcadeRigidBody>().collisionFlags.bottom) {
            body.velocity.y -=parameters.jumpVelocity;
            if (parameters.jumpAnimation) {
                gameObject.playFrameAnimation(parameters.jumpAnimation);
            }
        }
    }

    public override update() {
        super.update();
        const body = this.gameObject.getRigidBody<ArcadeRigidBody>()
        this.onGround = body.collisionFlags.bottom;
        this.onLadder = body.overlappedWith?.addInfo?.tileId===3;
        if (!this.onLadder) body.gravityImpact = 1;
        if (!this.onGround && this.gameObject.getCurrentFrameAnimationName()!==this.parameters.jumpAnimation) {
            if (this.parameters.jumpAnimation!==undefined && !this.isFire) {
                this.gameObject.playFrameAnimation(this.parameters.jumpAnimation);
            }
        }
    }

    private doGroundAnimation():void {
        const gameObject = this.gameObject;
        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        const params = this.parameters;
        if (this.onGround && !this.isFire) {
            if (body.velocity.x) {
                gameObject.playFrameAnimation(params.runAnimation);
            }
            else {
                gameObject.playFrameAnimation(params.idleAnimation);
            }
        }
    }

}
