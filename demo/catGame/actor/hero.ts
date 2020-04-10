import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/geometry/animatedImage";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {Game} from "@engine/core/game";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Rect} from "@engine/geometry/rect";

export class Hero {

    private idleAnimation:CellFrameAnimation;
    private jumpAnimation:CellFrameAnimation;
    private rotateAnimation:CellFrameAnimation;
    private fallAnimation:CellFrameAnimation;
    private walkAnimation:CellFrameAnimation;

    private heroImage:AnimatedImage;

    constructor(private game:Game, spr:ResourceLink<ITexture>) {
        const img:AnimatedImage = new AnimatedImage(game);
        this.heroImage = img;
        img.setResourceLink(spr);

        this.idleAnimation = new CellFrameAnimation(game);
        this.idleAnimation.frames = [10,11,12,13];
        this.idleAnimation.duration = 1000;
        this.idleAnimation.setSpriteSheetSize(10,10);
        img.addFrameAnimation('idle',this.idleAnimation);

        this.jumpAnimation = new CellFrameAnimation(game);
        this.jumpAnimation.frames = [1,2,3,4,5,6];
        this.jumpAnimation.duration = 1000;
        this.jumpAnimation.isRepeat = false;
        this.jumpAnimation.setSpriteSheetSize(10,10);
        img.addFrameAnimation('jump',this.jumpAnimation);

        this.rotateAnimation = new CellFrameAnimation(game);
        this.rotateAnimation.frames = [20,21,22,23,24,25,26,27,28,29,30];
        this.rotateAnimation.duration = 1000;
        this.rotateAnimation.isRepeat = false;
        this.rotateAnimation.setSpriteSheetSize(10,10);
        img.addFrameAnimation('rotate',this.rotateAnimation);

        this.fallAnimation = new CellFrameAnimation(game);
        this.fallAnimation.frames = [32,33,34,35,36,37,38,39,40];
        this.fallAnimation.duration = 1000;
        this.fallAnimation.isRepeat = false;
        this.fallAnimation.setSpriteSheetSize(10,10);
        img.addFrameAnimation('fall',this.fallAnimation);

        this.walkAnimation = new CellFrameAnimation(game);
        this.walkAnimation.frames = [0,4,21,4];
        this.walkAnimation.duration = 1000;
        this.walkAnimation.setSpriteSheetSize(10,10);
        img.addFrameAnimation('walk',this.walkAnimation);

        this.game.camera.followTo(img);

        const rigidBody:ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            restitution: 0.2,
            rect: new Rect(15,10,15,30),
            //debug: true,
        });
        img.setRigidBody(rigidBody);
        game.getCurrScene().appendChild(img);
        img.transformPoint.setToCenter();

        this.rotateAnimation.play();
        this.rotateAnimation.once(FRAME_ANIMATION_EVENTS.completed, e=>this.idleAnimation.play());
        img.pos.x = 100;
        this.listenKeys();
    }

    private listenKeys():void {
        const velocity:number = 90;
        const jumpVelocity:number = 300;
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                    this.heroImage.getRigidBody()!.velocity.x = -velocity;
                    this.heroImage.scale.x = -1;
                    this.heroImage.anchorPoint.x = 3;
                    this.walkAnimation.play();
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.heroImage.getRigidBody()!.velocity.x = velocity;
                    this.heroImage.scale.x = 1;
                    this.heroImage.anchorPoint.x = 0;
                    this.walkAnimation.play();
                    break;
                case KEYBOARD_KEY.SPACE:
                    if (this.heroImage.getRigidBody<ArcadeRigidBody>()!.collisionFlags.bottom) {
                        this.heroImage.getRigidBody()!.velocity.y = -jumpVelocity;
                        this.jumpAnimation.play();
                        this.jumpAnimation.once(FRAME_ANIMATION_EVENTS.completed, ev=>this.idleAnimation.play());
                    }
                    break;
            }
        });
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.heroImage.getRigidBody()!.velocity.x = 0;
                    this.idleAnimation.play();
                    break;
            }
        });
    }

}
