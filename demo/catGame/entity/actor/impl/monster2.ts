import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";
import {Rect} from "@engine/geometry/rect";
import {MathEx} from "@engine/misc/mathEx";
import {AbstractMonster} from "../abstract/abstractMonster";

export class Monster2 extends AbstractMonster {

    public static readonly groupName:string = 'monster2';

    private baseVelocity:number = 90;

    constructor(protected game: Game, spr: ResourceLink<ITexture>) {
        super(game, spr);

        this.burstColor.setRGBA(200,255,200,100);

        this.idleAnimation = this.createFrameAnimation(
            'idle', [0,1,2,3,4],900 + MathEx.random(10,100),
            new Size(8,4)
        );

        this.walkAnimation = this.idleAnimation;


        this.attackAnimation = this.createFrameAnimation(
            'attack', [8,9,10,11,12],900 + MathEx.random(10,100),
            new Size(8,4)
        );

        this.createRigidBody({
            restitution: 0.9,
            rect: new Rect(20,20,23,33),
            groupNames: [Monster2.groupName,AbstractMonster.abstractMonsterGroup],
            //ignoreCollisionWithGroupNames: [Burster.groupName],
            //debug: true
        });


        this.game.getCurrScene().setInterval(()=>{
            this.trackPositionByHero();
        },2000);

        this.scheduleBurst();

        this.postConstruct();

    }

    private scheduleBurst(){
        this.game.getCurrScene().setTimeout(()=>{
            this.burstWithParticles();
            this.attackAnimation.play();
            this.scheduleBurst();
        },MathEx.random(2000,10000));

    }


    private trackPositionByHero():void{

        if (MathEx.random(0,10)<3) {
            this.idle();
            return;
        }

        if (MathEx.random(0,50)<10) {
            this.jump(100 - MathEx.random(-50,-100));
            return;
        }

        this.velocity = this.baseVelocity + MathEx.random(-5,5);
        this.turnToHero();

    }

}
