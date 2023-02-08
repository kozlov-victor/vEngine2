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
    onJumped?:()=>void;
    onLanded?:()=>void;
    verticalLadderTileIds?:number[];
    horizontalLadderTileIds?:number[];
    waterTileIds?:number[];
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
    private inWater = false;
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
        this.listenToCollisionsAndOverlaps();
        this.listenToKeys();

    }

    public goLeft():void {
        this.body.velocity.x = -this.parameters.velocity*this.getVelocityFactor();
        this.gameObject.scale.x = -Math.abs(this.gameObject.scale.x);
        this.correctHorizontalLadderPos();
        this.doGroundAnimation();
    }

    public goRight():void {
        this.body.velocity.x = this.parameters.velocity*this.getVelocityFactor();
        this.gameObject.scale.x = Math.abs(this.gameObject.scale.x);
        this.correctHorizontalLadderPos();
        this.doGroundAnimation();
    }

    public climbLadderUp():void {
        if (this.onLadder) {
            this.isClimbing = true;
            this.body.velocity.y = -this.parameters.velocity;
            this.body.gravityImpact = 0;
            this.correctVerticalLadderPos();
            this.parameters.climbVerticalAnimation?.gotoAndPlay(0);
        }
    }

    public climbLadderDown():void {
        if (this.onGround) return;
        if (this.onLadder) {
            this.isClimbing = true;
            this.body.velocity.y = this.parameters.velocity;
            this.body.gravityImpact = 0;
            this.correctVerticalLadderPos();
            this.parameters.climbVerticalAnimation?.gotoAndPlay(0);
        }
    }

    private correctVerticalLadderPos():void {
        if (this.isVerticalLadderTileId(this.body.overlappedWith?.addInfo?.tileId)) {
            const overlapped = this.body.overlappedWith as ArcadeRigidBody
            this.body.pos.x = overlapped.getMidX() - this.body._rect.width/2 - this.body._rect.x;
        }
    }

    private correctHorizontalLadderPos():void {
        if (this.isHorizontalLadderTileId(this.body.overlappedWith?.addInfo?.tileId)) {
            const overlapped = this.body.overlappedWith as ArcadeRigidBody
            this.body.pos.y = overlapped.getMidY() - this.body._rect.height/2 - this.body._rect.y;
        }
    }

    private getVelocityFactor():number {
        return this.inWater?0.5:1;
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
            this.parameters.onJumped?.();
        }
    }

    public override update() {
        super.update();
        const body = this.gameObject.getRigidBody<ArcadeRigidBody>();
        const oldOnGround = this.onGround;
        this.onGround = body.collisionFlags.bottom;
        this.onLadder = this.isLadderTileId(body.overlappedWith?.addInfo?.tileId);
        this.inWater = this.isWaterTileId(body.overlappedWith?.addInfo?.tileId);

        if (this.onGround && !oldOnGround) this.parameters.onLanded?.();

        // to avoid bumping from walls while walking
        if (this.onGround || this.onLadder) {
            if (this.gameObject.scale.x>0 && this.body.velocity.x<0) this.body.velocity.x = 0;
            else if (this.gameObject.scale.x<0 && this.body.velocity.x>0) this.body.velocity.x = 0;
        }
        // to avoid bumping with ground while climbing down
        if (this.isClimbing && this.body.collisionFlags.bottom) {
            this.body.velocity.y = 0;
        }

        if (!this.onLadder) {
            body.gravityImpact = 1;
            this.isClimbing = false;
        }
        if (this.inWater) {
            body.gravityImpact = 0.2;
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

    private listenToCollisionsAndOverlaps():void {
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, b=>{
            this.body.gravityImpact = 1;
            this.doGroundAnimation();
        });
        this.body.collisionEventHandler.on(ARCADE_COLLISION_EVENT.OVERLAPPED, e=>{
            if (this.isLadderTileId(e.addInfo.tileId)) {
                this.body.gravityImpact = 0;
                if (!this.isClimbing) {
                    this.body.velocity.y = 0;
                    this.doGroundAnimation();
                }
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

        if (this.onGround) {
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


    private static _isTileIdOfType(tileId:number|undefined,arrToBelong?:number[]):boolean {
        if (tileId===undefined || arrToBelong===undefined) return false;
        return arrToBelong.includes(tileId);
    }

    private isVerticalLadderTileId(tileId:number|undefined):boolean {
        return ArcadeSideScrollControl._isTileIdOfType(tileId,this.parameters.verticalLadderTileIds);
    }

    private isHorizontalLadderTileId(tileId:number|undefined):boolean {
        return ArcadeSideScrollControl._isTileIdOfType(tileId,this.parameters.horizontalLadderTileIds);
    }

    private isWaterTileId(tileId:number|undefined):boolean {
        return ArcadeSideScrollControl._isTileIdOfType(tileId,this.parameters.waterTileIds);
    }

    private isLadderTileId(tileId:number|undefined):boolean {
        return this.isHorizontalLadderTileId(tileId) || this.isVerticalLadderTileId(tileId);
    }

}
