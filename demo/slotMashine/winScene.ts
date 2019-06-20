import {Scene} from "@engine/model/impl/general/scene";
import {ParticleSystem} from "@engine/model/impl/general/particleSystem";
import {Circle} from "@engine/model/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {BLEND_MODE} from "@engine/model/abstract/renderableModel";
import {Color} from "@engine/renderer/color";

export class WinScene extends Scene {

    private emitter:ParticleSystem = new ParticleSystem(this.game);

    public onPreloading(){

    }

    public onReady(){
        const p:Circle = new Circle(this.game);
        p.radius = 5;
        this.colorBG = Color.RGB(10,30,40);
        p.blendMode = BLEND_MODE.ADDITIVE;
        p.fillColor = Color.RGB(240,10,140);
        this.emitter.numOfParticlesToEmit = {from: 10,to:50};
        this.emitter.addParticle(p);
        this.emitter.particleVelocity = {from:1,to:20};
        this.emitter.particleLiveTime = {from:100,to:500};
        this.setInterval(()=>{
            const x:number = MathEx.random(0,this.game.width);
            const y:number = MathEx.random(0,this.game.height);
            this.emitter.emissionPosition.setXY(x,y);
            this.emitter.emit();
        },1000);
        this.appendChild(this.emitter);
    }

}