import {Scene} from "@engine/scene/scene";
import {
    MAX_PARTICLE_CACHE_STRATEGY,
    ParticleSystem
} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {DebugLayer} from "@engine/scene/debugLayer";


export class MainScene extends Scene {

    public override onPreloading():void {

    }

    public override onReady():void {

        const particle1 = new BatchedImage(this.game);
        //particle1.lineWidth = 0;
        particle1.size.setWH(10);
        particle1.angleVelocity = 0.3;
        particle1.fillColor.setFrom(ColorFactory.fromCSS('#f10909'));

        const particle2 = particle1.clone();
        particle2.fillColor.setFrom(ColorFactory.fromCSS('#e0d607'));

        const particle3 = particle1.clone();
        particle3.fillColor.setFrom(ColorFactory.fromCSS('#3a0224'));

        const ps = new ParticleSystem(this.game,10_000);
        ps.addParticlePrefab(particle1);
        ps.addParticlePrefab(particle2);
        ps.addParticlePrefab(particle3);
        ps.emissionRadius = 20;
        ps.forceDrawChildrenOnNewSurface = true;
        ps.particleGravity.y = 5;

        ps.numOfParticlesToEmit = {from:100,to:120};
        ps.particleLiveTime = {from:1500,to:2500};
        ps.particleAngle = {from:MathEx.degToRad(270-30),to:MathEx.degToRad(270+30)};
        ps.particleVelocity = {from: 100, to: 200};
        ps.emissionRadius = 30;
        ps.emitAuto = false;
        ps.onEmitParticle(p=>{
            const b = p as BatchedImage;
            b.fillColor.a=255;
        });
        ps.onUpdateParticle(p=>{
            const b = p as BatchedImage;
            if (b.fillColor.a>0) b.fillColor.a-=2;
        });
        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseDown,(e)=>{
            ps.emitAuto = true;
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseUp,(e)=>{
            ps.emitAuto = false;
        });

        const layer = new DebugLayer(this.game);
        layer.appendTo(this);
        this.setInterval(()=>{
            layer.println(ps.getChildrenCount());
        },1000);

    }
}
