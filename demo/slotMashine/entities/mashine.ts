import {Wheel} from "./wheel";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/game";
import {Scene} from "@engine/model/impl/scene";
import {MathEx} from "@engine/misc/mathEx";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {WinScene} from "../winScene";
import {defineWinType, WIN_TYPE} from "./common";

export class Mashine {

    public locked:boolean = false;
    private wheels:Wheel[] = [];

    constructor(private game:Game,private resourceLink:ResourceLink<Texture>){
        const cellDeltaHeight:number = 160;
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = new Wheel(game,resourceLink);
            wheel.image.pos.setXY(i*Wheel.CELL_WIDTH+i*Wheel.CELL_PADDING,-cellDeltaHeight);
            wheel.mashine = this;
            this.wheels[i] = wheel;
        }
        this.wheels[0].image.pos.addX(40);
        this.wheels[2].image.pos.addX(-40);
    }

    public connectToScene(scene:Scene){
        for (let i:number = 0;i<3;i++){
            scene.appendChild(this.wheels[i].image);
        }
    }

    public isFree():boolean {
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = this.wheels[i];
            if (!wheel.isFree()) return false;
        }
        return true;
    }

    public onSpinCompleted(){
        const result:number[] = [];
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = this.wheels[i];
            result.push(wheel.position);
        }

        window.top.postMessage({
            command:'machineCompleted',
            result
        },'*');


        const isWIN:boolean = defineWinType(result)!==WIN_TYPE.NO_PRISE;
        if (isWIN) {
            this.locked = true;
            this.game.getCurrScene().setTimeout(()=>{
                this.game.runScene(new WinScene(this.game));
            },3000);
        }

    }

    public spin(a:number,b:number,c:number){

        if (!this.isFree()) return;
        if (this.locked) return;

        let freeSpins:number = MathEx.randomInt(2,5);
        let delayTime:number = 0;
        const spinsTo:number[] = [a,b,c];
        for (let i:number = 0;i<3;i++){
            const wheel:Wheel = this.wheels[i];
            wheel.spinTo(spinsTo[i],freeSpins,delayTime);
            delayTime+=MathEx.randomInt(100,500);
            freeSpins+=MathEx.randomInt(2,5);
        }
    }


}