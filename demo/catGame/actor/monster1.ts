import {AbstractMonster} from "./abstract/abstract";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {Size} from "@engine/geometry/size";
import {Rect} from "@engine/geometry/rect";
import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Hero} from "./hero";
import {MathEx} from "@engine/misc/mathEx";

export class Monster1 extends AbstractMonster {

    public static readonly groupName:string = 'Monster1';

    private walkAnimation:CellFrameAnimation;
    private idleAnimation:CellFrameAnimation;

    private body:ArcadeRigidBody;
    private baseVelocity:number = 30;
    private velocity:number = this.baseVelocity;


    constructor(protected game: Game, spr: ResourceLink<ITexture>) {
        super(game, spr);

        this.idleAnimation = this.createFrameAnimation(
            'idle', [5,6],1000,
            new Size(5,5)
        );

        this.walkAnimation = this.createFrameAnimation(
            'walk', [0,1,2,3,4],1000,
            new Size(5,5)
        );
        this.appendToScene();
        this.body = this.createRigidBody({
            restitution: 0.2,
            rect: new Rect(15,10,25,30),
            groupNames: [Monster1.groupName,'entity'],
            ignoreCollisionWithGroupNames: ['entity'],
            //debug: true
        });
        this.idleAnimation.play();

        this.game.getCurrScene().setInterval(()=>{
            this.trackPositionByHero();
        },2000);

        this.scheduleBurst();

    }

    private scheduleBurst(){
        this.game.getCurrScene().setTimeout(()=>{
            this.burstWithParticles();
            this.scheduleBurst();
        },MathEx.random(5000,15000));

    }

    private goLeft():void {
        this.body.velocity.x = -this.velocity;
        this.renderableImage.scale.x = -1;
        this.walkAnimation.play();
    }

    private goRight():void {
        this.body.velocity.x = this.velocity;
        this.renderableImage.scale.x = 1;
        this.walkAnimation.play();
    }

    private idle():void {
        this.body.velocity.x = 0;
        this.idleAnimation.play();
    }

    private trackPositionByHero():void{

        if (MathEx.random(0,10)<3) {
            this.idle();
            return;
        }

        const hero:Hero = Hero.getCreatedInstance();
        this.velocity = this.baseVelocity + MathEx.random(-5,5);
        if (this.renderableImage.pos.x>hero.getRenderableModel().pos.x) {
            this.goLeft();
        } else {
            this.goRight();
        }
    }

}
