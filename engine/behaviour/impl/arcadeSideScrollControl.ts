import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {ARCADE_COLLISION_EVENT, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Game} from "@engine/core/game";
import {IKeyVal} from "@engine/misc/object";
import {DebugError} from "@engine/debug/debugError";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";

interface IParams extends IKeyVal<any>{
    velocity: number;
    jumpVelocity: number;
    runAnimation: string;
    idleAnimation: string;
    jumpAnimation?: string;
    fireAnimation?:string;
}

export class ArcadeSideScrollControl extends BaseAbstractBehaviour{

    protected declare parameters: IParams;
    private gameObject:AnimatedImage;
    private onGround = false;
    private isFire = false;

    constructor(game: Game, parameters: IParams) {
        super(game, parameters);
    }

    public clone(): this {
        return undefined!;
    }

    public manage(gameObject: AnimatedImage): void {

        this.gameObject = gameObject;
        const params = this.parameters;
        gameObject.transformPoint.setToCenter();
        gameObject.playFrameAnimation(params.idleAnimation);

        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (DEBUG && body===undefined) {
            throw new DebugError(`cannot apply behaviour: ${this.constructor.name}, rigid body is not set`);
        }

        body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, _=>{
            this.doGroundAnimation();
        });

        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    body.velocity.x = -params.velocity;
                    gameObject.scale.x = -Math.abs(gameObject.scale.x);
                    this.doGroundAnimation();
                    break;
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.x = params.velocity;
                    gameObject.scale.x = Math.abs(gameObject.scale.x);
                    this.doGroundAnimation();
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.SPACE:
                    if (this.gameObject.getRigidBody<ArcadeRigidBody>().collisionFlags.bottom) {
                        body.velocity.y -=params.jumpVelocity;
                        if (params.jumpAnimation) {
                            gameObject.playFrameAnimation(params.jumpAnimation);
                        }
                    }
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.x = 0;
                    if (this.onGround) gameObject.playFrameAnimation(params.idleAnimation);
                    break;
                default:
                    break;
            }
        });

    }

    public fire():void {
        if (this.parameters.fireAnimation) {
            this.isFire = true;
            this.gameObject.
                playFrameAnimation(this.parameters.fireAnimation).
                animationEventHandler.once(FRAME_ANIMATION_EVENTS.completed, ()=>{
                    this.isFire = false;
                    this.doGroundAnimation();
                });
        }
    }

    public override update() {
        super.update();
        this.onGround = this.gameObject.getRigidBody<ArcadeRigidBody>().collisionFlags.bottom;
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
