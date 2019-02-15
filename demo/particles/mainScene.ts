import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/core/renderer/color";
import {ParticleSystem} from "@engine/model/impl/particleSystem";


export class MainScene extends Scene {

    private ps:ParticleSystem;

    onPreloading() {
        let rect:Rectangle = new Rectangle(this.game);
        rect.width = 10;
        rect.height = 10;
        (rect.fillColor as Color).setRGBA(0,200,0);
        let ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(rect);

        let rect2 = rect.clone();
        (rect2.fillColor as Color).setRGBA(0,2,220);
        ps.addParticle(rect2);

        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:100,to:300};
        ps.particleAngle = {from:0,to:2*Math.PI};
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
        //ps.particleAngle.from = ps.particleAngle.from+0.1;
        //ps.particleAngle.to = ps.particleAngle.to+0.1;
        this.ps.angle+=0.1;
    }
}
