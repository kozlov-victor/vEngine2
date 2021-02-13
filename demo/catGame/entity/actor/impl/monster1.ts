import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";
import {Rect} from "@engine/geometry/rect";
import {MathEx} from "@engine/misc/mathEx";
import {AbstractMonster} from "../abstract/abstractMonster";
import {Sound} from "@engine/media/sound";

export class Monster1 extends AbstractMonster {

    public static readonly groupName:string = 'monster1';

    private baseVelocity:number = 70;

    constructor(protected game: Game, spr: ITexture,hurtSound:Sound) {
        super(game, spr,hurtSound,{
            restitution: 0.2,
            rect: new Rect(20,20,23,33),
            groupNames: [Monster1.groupName, AbstractMonster.groupName],
            //ignoreCollisionWithGroupNames: [Burster.groupName],
            //debug: true
        });

        this.game.getCurrScene().setInterval(()=>{
            this.trackPositionByHero();
        },2000);

        this.scheduleBurst();
    }

    protected onCreatedFrameAnimation(): void {
        this.idleAnimation = this.createFrameAnimation(
            'idle', [0,1,2,3],900 + MathEx.random(10,100),
            new Size(8,8)
        );

        this.walkAnimation = this.createFrameAnimation(
            'walk', [8,9,10,11,12],900 + MathEx.random(10,100),
            new Size(8,8)
        );


        this.attackAnimation = this.createFrameAnimation(
            'attack', [16,17,18,19,20,21],900 + MathEx.random(10,100),
            new Size(8,8)
        );
    }

    private scheduleBurst():void{
        this.game.getCurrScene().setTimeout(()=>{
            this.burstWithParticles();
            this.attackAnimation.play();
            this.scheduleBurst();
        },MathEx.random(5000,15000));

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
