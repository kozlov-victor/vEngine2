import {Scene} from "@engine/core/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/color";
import {Game} from "@engine/core/game";

export class WinScene extends Scene {

    private emitter:ParticleSystem = new ParticleSystem(this.game);


    constructor(game:Game){super(game);}

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