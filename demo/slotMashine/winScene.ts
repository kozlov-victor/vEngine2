import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";

export class WinScene extends Scene {

    private emitter:ParticleSystem = new ParticleSystem(this.game);


    constructor(game:Game){super(game);}

    public override onPreloading():void{

    }

    public override onReady():void{
        const p:Circle = new Circle(this.game);
        p.radius = 5;
        this.backgroundColor = Color.RGB(10,30,40);
        p.blendMode = BLEND_MODE.ADDITIVE;
        p.fillColor = Color.RGB(240,10,140);
        this.emitter.numOfParticlesToEmit = {from: 10,to:50};
        this.emitter.addParticlePrefab(p);
        this.emitter.particleVelocity = {from:1,to:20};
        this.emitter.particleLiveTime = {from:100,to:500};
        this.emitter.emitAuto = false;
        this.setInterval(()=>{
            const x:number = MathEx.random(0,this.game.size.width);
            const y:number = MathEx.random(0,this.game.size.height);
            this.emitter.emissionPosition.setXY(x,y);
            this.emitter.emit();
        },1000);
        this.appendChild(this.emitter);
    }

}
