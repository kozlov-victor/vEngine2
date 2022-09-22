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
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";

interface IParams {
    velocity: number;
    jumpVelocity: number;
    ladderTileIds?:number[];
    tileMap?:TileMap;
    runAnimation: AbstractFrameAnimation<IRectJSON>;
    idleAnimation: AbstractFrameAnimation<IRectJSON>;
    jumpAnimation?: AbstractFrameAnimation<IRectJSON>;
    fireAnimation?:AbstractFrameAnimation<IRectJSON>;
    climbVerticalAnimation?:AbstractFrameAnimation<IRectJSON>;
    climbHorizontalAnimation?:AbstractFrameAnimation<IRectJSON>;
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
        super(game, parameters as IKeyVal<any>);
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
            if (this.parameters.climbVerticalAnimation) this.parameters.climbVerticalAnimation.gotoAndPlay(0);
        }
    }

    public climbLadderDown():void {
        if (this.onGround) return;
        if (this.onLadder) {
            this.isClimbing = true;
            this.body.velocity.y = this.parameters.velocity;
            this.body.gravityImpact = 0;
            if (this.parameters.climbVerticalAnimation) this.parameters.climbVerticalAnimation.gotoAndPlay(0);
        }
    }

    public stopClimbing(): void {
        if (this.onLadder) {
            this.body.velocity.y = 0;
            this.isClimbing = false;
            if (this.gameObject.getCurrentFrameAnimation()===this.parameters.climbVerticalAnimation) {
                this.parameters.climbVerticalAnimation?.gotoAndStop(1);
            }
        }
    }

    public stop():void {
        this.body.velocity.x = 0;
        if ((this.onGround || this.onLadder) && !this.isClimbing) this.parameters.idleAnimation.play();
    }

    public fire():void {
        if (this.parameters.fireAnimation) {
            this.isFiring = true;
            const an = this.parameters.fireAnimation;
            an.play();
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
            this.parameters.jumpAnimation?.play();
        }
    }

    public override update() {
        super.update();
        const body = this.gameObject.getRigidBody<ArcadeRigidBody>()
        this.onGround = body.collisionFlags.bottom;
        this.onLadder = this.isLadderTileId(body.overlappedWith?.addInfo?.tileId);
        if (!this.onLadder) {
            body.gravityImpact = 1;
            this.isClimbing = false;
        }
        if (!this.onGround && !this.onLadder) {
            if (!this.isFiring) {
                this.parameters.jumpAnimation?.play();
            }
        }
    }

    private init():void {
        this.gameObject.addFrameAnimation(this.parameters.runAnimation);
        this.gameObject.addFrameAnimation(this.parameters.idleAnimation);
        if (this.parameters.jumpAnimation) this.gameObject.addFrameAnimation(this.parameters.jumpAnimation);
        if (this.parameters.fireAnimation) this.gameObject.addFrameAnimation(this.parameters.fireAnimation);
        if (this.parameters.climbVerticalAnimation) this.gameObject.addFrameAnimation(this.parameters.climbVerticalAnimation);
        if (this.parameters.climbHorizontalAnimation) this.gameObject.addFrameAnimation(this.parameters.climbHorizontalAnimation);

        this.gameObject.transformPoint.setToCenter();
        this.parameters.idleAnimation.play();

        const body = this.gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (DEBUG && body===undefined) {
            throw new DebugError(`cannot apply behaviour: ${this.constructor.name}, rigid body is not set`);
        }
        this.body = body;
    }

    private listenToCollisions():void {
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, _=>{
            this.body.gravityImpact = 1;
            if (this.isClimbing && this.body.collisionFlags.bottom) {
                this.body.velocity.y = 0;
            } // to avoid bumping with ground while climbing down
            this.doGroundAnimation();
        });
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.OVERLAPPED, e=>{
            if (!this.parameters.ladderTileIds?.includes(e.addInfo.tileId)) return;
            this.body.gravityImpact = 0;
            if (!this.isClimbing) {
                this.body.velocity.y = 0;
                this.doGroundAnimation();
            }
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
        if (this.isFiring) return;

        if ((this.onGround)) {
            if (body.velocity.x) {
                params.runAnimation.play();
            }
            else {
                params.idleAnimation.play();
            }
        } else if (this.onLadder) {
            if (body.velocity.x) {
                params.climbHorizontalAnimation?.gotoAndPlay(0);
            }
            else {
                params.climbVerticalAnimation?.gotoAndStop(1);
            }
        }
    }

    private isLadderTileId(tileId:number|undefined):boolean {
        if (tileId===undefined) return false;
        if (this.parameters.ladderTileIds===undefined) return false;
        return this.parameters.ladderTileIds.includes(tileId);
    }

}
