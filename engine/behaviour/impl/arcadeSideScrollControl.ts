import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {ARCADE_COLLISION_EVENT, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Game} from "@engine/core/game";
import {IKeyVal} from "@engine/misc/object";
import {DebugError} from "@engine/debug/debugError";

interface IParams extends IKeyVal<any>{
    velocity: number;
    jumpVelocity: number;
    runAnimation: string;
    idleAnimation: string;
    jumpAnimation?: string;
}

export class ArcadeSideScrollControl extends BaseAbstractBehaviour{

    protected declare parameters: IParams;

    constructor(game: Game, parameters: IParams) {
        super(game, parameters);
    }

    public clone(): this {
        return undefined!;
    }

    public manage(gameObject: AnimatedImage): void {

        const params = this.parameters;
        gameObject.transformPoint.setToCenter();
        gameObject.playFrameAnimation(params.idleAnimation);

        const body = gameObject.getRigidBody<ArcadeRigidBody>()!;
        if (DEBUG && body===undefined) {
            throw new DebugError(`cannot apply behaviour: ${this.constructor.name}, rigid body is not set`);
        }


        body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, e=>{
            if (body.collisionFlags.bottom && gameObject.getCurrentFrameAnimationName()===params.jumpAnimation) {
                if (body.velocity.x) {
                    gameObject.playFrameAnimation(params.runAnimation);
                }
                else {
                    gameObject.playFrameAnimation(params.idleAnimation);
                }
            }
        });

        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    body.velocity.x = -params.velocity;
                    gameObject.scale.x = -Math.abs(gameObject.scale.x);
                    if (gameObject.getCurrentFrameAnimationName()!==params.runAnimation) gameObject.playFrameAnimation(params.runAnimation);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.x = params.velocity;
                    gameObject.scale.x = Math.abs(gameObject.scale.x);
                    if (gameObject.getCurrentFrameAnimationName()!==params.runAnimation) gameObject.playFrameAnimation(params.runAnimation);
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.SPACE:
                    if (gameObject.getRigidBody<ArcadeRigidBody>().collisionFlags.bottom) {
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
                    gameObject.playFrameAnimation(params.idleAnimation);
                    break;
                default:
                    break;
            }
        });

    }

}
