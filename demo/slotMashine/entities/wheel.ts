import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image";
import {Tween} from "@engine/animation/tween";
import {Machine} from "./machine";
import {ITexture} from "@engine/renderer/common/texture";
import {EasingBounce} from "@engine/misc/easing/functions/bounce";

export class Wheel {

    public static readonly CELL_WIDTH:number = 215;
    public static readonly CELL_PADDING:number = 50;
    public static readonly CELL_HEIGHT:number = 251;
    private static readonly CELLS_IN_WHEEL:number = 5;

    public position:number = 0;
    public image:Image;
    public mashine!:Machine;

    private free:boolean = true;

    constructor(private game:Game,public resourceLink:ITexture){
        this.image = new Image(game,resourceLink);
    }

    public spinTo(n:number,freeSpins:number,delayTime:number):void{

        if (!this.free) return;

        n = n % (Wheel.CELLS_IN_WHEEL+1);
        this.position = n;

        this.free = false;

        const target = {val:this.image.offset.y};
        const t = new Tween({
            target,
            delayBeforeStart: delayTime,
            to: {val:
                (freeSpins*Wheel.CELLS_IN_WHEEL + n)*Wheel.CELL_HEIGHT -
                Wheel.CELL_HEIGHT},
            time: freeSpins * 1000,
            progress: ({val}:{val:number})=>{
                this.image.offset.setY(val);
            },
            complete: ()=>{
                this.free = true;
                if (this.mashine.isFree()) this.mashine.onSpinCompleted();
            },
            ease:EasingBounce.InOut
        });
        this.game.getCurrentScene().addTween(t);

    }

    public isFree():boolean {
        return this.free;
    }



}
