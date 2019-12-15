import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {Shape} from "@engine/renderable/abstract/shape";


export class MainScene extends Scene {

    private ps!:ParticleSystem;

    public onPreloading() {
        console.log('on preloading');
    }

    // onProgress(val: number) {
    //
    // }
    //
    public onReady() {
        console.log('on ready');
        this.colorBG.setRGB(20,20,75);
        const circle:Circle = new Circle(this.game);
        circle.radius = MathEx.random(1,4);
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        (circle.fillColor as Color).setRGBA(122,200,0);

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(MathEx.random(1,3));
        rect.transformPoint.setXY(rect.size.width/2,rect.size.height/2);
        (rect.fillColor as Color).setRGBA(0,200,0);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(circle);
        ps.addParticle(rect);
        ps.emissionRadius = 5;

        ps.onEmitParticle((r:RenderableModel)=>{
            r.blendMode = BLEND_MODE.ADDITIVE;
            ((r as Shape).fillColor as Color).setRGB(MathEx.randomInt(0,255) as byte,MathEx.randomInt(0,255) as byte,MathEx.randomInt(0,255) as byte);
        });
        ps.onUpdateParticle((r:RenderableModel)=>r.angle+=0.1);


        ps.numOfParticlesToEmit = {from:10,to:50};
        ps.particleLiveTime = {from:100,to:500};
        ps.particleAngle = {from:0,to:2*Math.PI};
        ps.size.setWH(50,50);
        this.ps = ps;
        this.appendChild(ps);
        this.on(MOUSE_EVENTS.mouseMove,(e:IMousePoint)=>{
            console.log(e);
            this.ps.emissionPosition.setXY(e.screenX,e.screenY);
        });
    }


    public onUpdate() {
        this.ps.emit();
        const ps:ParticleSystem = this.ps;
        // ps.particleAngle.from = ps.particleAngle.from+0.1;
        // ps.particleAngle.to = ps.particleAngle.to+0.1;
        // // this.ps.angle+=0.1;
    }
}
