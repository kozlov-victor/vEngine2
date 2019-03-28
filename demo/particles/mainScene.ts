import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {ParticleSystem} from "@engine/model/impl/particleSystem";
import {MathEx} from "@engine/misc/mathEx";


export class MainScene extends Scene {

    private ps:ParticleSystem;

    onPreloading() {
        let rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(20);
        (rect.fillColor as Color).setRGBA(0,200,0);
        let ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(rect);
        ps.emissionRadius = 5;
        ps.onEmitParticle((r:Rectangle)=>{
            (r.fillColor as Color).setRGB(MathEx.random(0,255),MathEx.random(0,255),MathEx.random(0,255));
        });
        ps.onUpdateParticle((r:Rectangle)=>r.angle+=0.1);

        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:1000,to:3000};
        ps.particleAngle = {from:0,to:Math.PI/4};
        ps.pos.setXY(50,50);
        this.ps = ps;
        this.appendChild(ps);
    }

    // onProgress(val: number) {
    //
    // }
    //
    onReady() {
        console.log('on ready');
    }


    onUpdate() {
        this.ps.emit();
        let ps = this.ps;
        ps.particleAngle.from = ps.particleAngle.from+0.1;
        ps.particleAngle.to = ps.particleAngle.to+0.1;
        //this.ps.angle+=0.1;
    }
}
