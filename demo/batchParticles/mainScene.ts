import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";


export class MainScene extends Scene {

    public override onPreloading():void {

    }

    public override onReady():void {

        const particle1 = new BatchedImage(this.game);
        //particle1.lineWidth = 0;
        particle1.size.setWH(10);
        particle1.angleVelocity = 0.3;
        particle1.fillColor.setFrom(ColorFactory.fromCSS('#fa081d'));

        const particle2 = particle1.clone();
        particle2.fillColor.setFrom(ColorFactory.fromCSS('#50020a'));


        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(particle1);
        ps.addParticlePrefab(particle2);
        ps.emissionRadius = 20;
        ps.forceDrawChildrenOnNewSurface = true;
        ps.particleGravity.y = 5;

        ps.numOfParticlesToEmit = {from:5,to:10};
        ps.particleLiveTime = {from:1000,to:3000};
        ps.particleAngle = {from:MathEx.degToRad(270-30),to:MathEx.degToRad(270+30)};
        ps.particleVelocity = {from: 100, to: 200};
        ps.onEmitParticle(p=>{
            const b = p as BatchedImage;
            b.fillColor.a=255;
        });
        ps.onUpdateParticle(p=>{
            const b = p as BatchedImage;
            b.fillColor.a-=2;
        });
        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
        });
    }
}
