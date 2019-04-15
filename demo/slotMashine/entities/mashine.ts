import {Wheel} from "./wheel";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/game";
import {Scene} from "@engine/model/impl/scene";
import {MathEx} from "@engine/misc/mathEx";
import random = MathEx.random;
export class Mashine {

    private wheels:Wheel[] = [];

    constructor(game:Game,private resourceLink:ResourceLink){
        const cellDeltaHeight:number = 160;
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = new Wheel(game,resourceLink);
            wheel.image.pos.setXY(i*Wheel.CELL_WIDTH,-cellDeltaHeight);
            wheel.mashine = this;
            this.wheels[i] = wheel;
        }
    }

    connectToScene(scene:Scene){
        for (let i:number = 0;i<3;i++){
            scene.appendChild(this.wheels[i].image);
        }
    }

    isFree():boolean {
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = this.wheels[i];
            if (!wheel.isFree()) return false;
        }
        return true;
    }

    onSpinCompleted(){
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = this.wheels[i];
            console.log(wheel.position);
        }
    }

    spin(){

        if (!this.isFree()) return;

        let freeSpins:number = MathEx.random(2,5);
        let delayTime:number = 0;
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = this.wheels[i];
            wheel.spinTo(MathEx.random(0,4),freeSpins,delayTime);
            delayTime+=MathEx.random(100,500);
            freeSpins+=MathEx.random(2,5);
        }
    }


}