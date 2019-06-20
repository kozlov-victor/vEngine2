import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {ParticleSystem} from "@engine/model/impl/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {BLEND_MODE, RenderableModel} from "@engine/model/renderableModel";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {Shape} from "@engine/model/impl/ui/generic/shape";


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
        circle.radius = MathEx.random(5,20);
        circle.rotationPoint.setXY(circle.radius/2,circle.radius/2);
        (circle.fillColor as Color).setRGBA(0,200,0);

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(MathEx.random(10,20));
        rect.rotationPoint.setXY(rect.size.width/2,rect.size.height/2);
        (rect.fillColor as Color).setRGBA(0,200,0);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(circle);
        ps.addParticle(rect);
        ps.emissionRadius = 5;

        const sb:SimpleBlurFilter = new SimpleBlurFilter(this.game);
        sb.setSize(2);

        ps.onEmitParticle((r:RenderableModel)=>{
            r.blendMode = BLEND_MODE.ADDITIVE;
            // r.filters = [sb];
            ((r as Shape).fillColor as Color).setRGB(MathEx.random(0,255),MathEx.random(0,255),MathEx.random(0,255));
        });
        ps.onUpdateParticle((r:RenderableModel)=>r.angle+=0.1);


        ps.numOfParticlesToEmit = {from:1,to:10};
        ps.particleLiveTime = {from:1000,to:3000};
        ps.particleAngle = {from:0,to:Math.PI/4};
        ps.pos.setXY(50,50);
        ps.size.setWH(50,50);
        ps.addBehaviour(new DraggableBehaviour(this.game));
        this.ps = ps;
        this.appendChild(ps);
    }


    public onUpdate() {
        this.ps.emit();
        const ps = this.ps;
        ps.particleAngle.from = ps.particleAngle.from+0.1;
        ps.particleAngle.to = ps.particleAngle.to+0.1;
        // this.ps.angle+=0.1;
    }
}
