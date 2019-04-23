import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/game";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Tween} from "@engine/misc/tween";
import {Easing} from "@engine/misc/easing";
import {Mashine} from "./mashine";
import {Texture} from "@engine/renderer/webGl/base/texture";
export class Wheel {

    position:number = 0;
    image:Image;
    mashine:Mashine;

    static readonly CELL_WIDTH:number = 215;
    static readonly CELL_PADDING:number = 50;
    static readonly CELL_HEIGHT:number = 251;
    private static readonly CELLS_IN_WHEEL:number = 5;

    private free:boolean = true;

    constructor(private game:Game,public resourceLink:ResourceLink<Texture>){
        this.image = new Image(game);
        this.image.setResourceLink(resourceLink);

    }

    spinTo(n:number,freeSpins:number,delayTime:number){

        if (!this.free) return;

        n = n % (Wheel.CELLS_IN_WHEEL+1);
        this.position = n;

        this.free = false;

        const target = {val:this.image.offset.y};
        const t:Tween = new Tween({
            target,
            delayBeforeStart: delayTime,
            to: {val:
                (freeSpins*Wheel.CELLS_IN_WHEEL + n)*Wheel.CELL_HEIGHT -
                Wheel.CELL_HEIGHT},
            time: freeSpins * 1000,
            progress: ({val}:{val:number})=>{
                this.image.offset.setY(val)
            },
            complete: ()=>{
                this.free = true;
                if (this.mashine.isFree()) this.mashine.onSpinCompleted();
            },
            ease:Easing.easeOutBounce
        });
        this.game.getCurrScene().addTween(t);
    }

    isFree():boolean {
        return this.free;
    }



}


// target:any,
// progress?:Function,
// complete?:Function,
// ease?:EaseFn,
// time:number,
// from?:{[key:string]:number},
// to?:{[key:string]:number}