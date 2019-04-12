import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {ParticleSystem} from "@engine/model/impl/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {BLEND_MODE, RenderableModel} from "@engine/model/renderableModel";
import {TriangleBlurFilter} from "@engine/renderer/webGl/filters/textureFilters/triangleBlurFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/textureFilters/simpleBlurFilter";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {Shape} from "@engine/model/impl/ui/generic/shape";


export class MainScene extends Scene {

    private ps:ParticleSystem;

    onPreloading() {
        console.log('on preloading');
    }

    // onProgress(val: number) {
    //
    // }
    //
    onReady() {
        console.log('on ready');
        this.colorBG.setRGB(20,20,75);
        let circle:Circle = new Circle(this.game);
        circle.radius = 20;
        (circle.fillColor as Color).setRGBA(0,200,0);

        let rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(30);
        (rect.fillColor as Color).setRGBA(0,200,0);

        let ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(circle);
        ps.addParticle(rect);
        ps.emissionRadius = 5;

        const blur:TriangleBlurFilter = new TriangleBlurFilter(this.game);
        blur.setValue(0.01);
        const sb:SimpleBlurFilter = new SimpleBlurFilter(this.game);
        sb.setSize(2);

        ps.onEmitParticle((r:Shape)=>{
            r.blendMode = BLEND_MODE.ADDITIVE;
            r.filters = [sb];
            (r.fillColor as Color).setRGB(MathEx.random(0,255),MathEx.random(0,255),MathEx.random(0,255));
        });
        ps.onUpdateParticle((r:Rectangle)=>r.angle+=0.1);


        ps.numOfParticlesToEmit = {from:1,to:10};
        ps.particleLiveTime = {from:1000,to:3000};
        ps.particleAngle = {from:0,to:Math.PI/4};
        ps.pos.setXY(50,50);
        ps.size.setWH(50,50);
        ps.addBehaviour(new DraggableBehaviour(this.game));
        this.ps = ps;
        this.appendChild(ps);
    }


    onUpdate() {
        this.ps.emit();
        let ps = this.ps;
        ps.particleAngle.from = ps.particleAngle.from+0.1;
        ps.particleAngle.to = ps.particleAngle.to+0.1;
        //this.ps.angle+=0.1;
    }
}
