

import {Scene} from "@engine/model/impl/scene";
import {ParticleSystem} from "@engine/model/impl/particleSystem";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {MathEx} from "@engine/misc/mathEx";
import {BLEND_MODE} from "@engine/model/renderableModel";
import {Color} from "@engine/renderer/color";

export class WinScene extends Scene {

    private emitter:ParticleSystem = new ParticleSystem(this.game);

    onPreloading(){

    }

    onReady(){
        const p:Circle = new Circle(this.game);
        p.radius = 5;
        this.colorBG = Color.RGB(10,30,40);
        p.blendMode = BLEND_MODE.ADDITIVE;
        p.fillColor = Color.RGB(240,10,140);
        this.emitter.numOfParticlesToEmit = {from: 50,to:200};
        this.emitter.addParticle(p);
        this.emitter.particleVelocity = {from:1,to:50};
        this.setTimer(()=>{
            const x:number = MathEx.random(0,this.game.width);
            const y:number = MathEx.random(0,this.game.height);
            this.emitter.emissionPosition.setXY(x,y);
            this.emitter.emit();
        },1000);
        this.appendChild(this.emitter);
    }

}