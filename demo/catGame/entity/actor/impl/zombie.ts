import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {MathEx} from "@engine/misc/math/mathEx";
import {Size} from "@engine/geometry/size";
import {Rect} from "@engine/geometry/rect";
import {Hero} from "./hero";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {AbstractMonster} from "../abstract/abstractMonster";
import {AbstractCharacter} from "../abstract/abstractCharacter";
import {Sound} from "@engine/media/sound";

export class Zombie extends AbstractMonster {

    public static override readonly groupName:string = 'zombie';

    constructor(game: Game, spr: ITexture,hurtSound:Sound) {
        super(game, spr,hurtSound,{
            restitution: 0.2,
            rect: new Rect(20,20,23,41),
            groupNames: [Zombie.groupName,AbstractMonster.groupName, AbstractCharacter.groupName],
            //ignoreCollisionWithGroupNames: [Burster.groupName],
            //debug: true
        });
        this.velocity = 10;

        this.scheduleWalk();
        this.body.onCollidedWithGroup(Hero.groupName,e=>{
            this.turnToHero();
            this.attackAnimation.play().animationEventHandler.once(FRAME_ANIMATION_EVENTS.completed, it=>this.idle());
        });

    }

    protected override onCreatedFrameAnimation(): void {
        this.idleAnimation = this.createFrameAnimation(
            'idle', [0,1,2,3],900 + MathEx.random(10,100),
            new Size(8,8)
        );

        this.walkAnimation = this.createFrameAnimation(
            'walk', [8,9,10,11],900 + MathEx.random(10,100),
            new Size(8,8)
        );

        this.attackAnimation = this.createFrameAnimation(
            'attack', [16,17,18,19],900 + MathEx.random(10,100),
            new Size(8,8)
        );
    }

    private scheduleWalk():void {
        this.game.getCurrentScene().setTimeout(()=>{
            const actionID:number = MathEx.random(0,10);
            if (actionID>8) this.idle();
            else if (actionID>5) {
                this.goLeft();
            }
            else this.goRight();
            this.scheduleWalk();
        },MathEx.random(2000,5000));
    }

}
