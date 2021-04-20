import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class MainScene extends Scene {

    public onPreloading():void {
        console.log('on preloading');
    }

    // onProgress(val: number) {
    //
    // }
    //
    public onReady():void {

        const circle:Circle = new Circle(this.game);
        circle.radius = 3;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.fillColor.setRGBA(122,200,0);
        circle.blendMode = BLEND_MODE.ADDITIVE;

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(MathEx.random(1,3));
        rect.transformPoint.setXY(rect.size.width/2,rect.size.height/2);
        rect.fillColor.setRGBA(133,200,0);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(circle);
        ps.addParticle(rect);
        ps.emissionRadius = 5;
        ps.forceDrawChildrenOnNewSurface = true;


        ps.numOfParticlesToEmit = {from:10,to:50};
        ps.particleLiveTime = {from:100,to:500};
        ps.particleAngle = {from:0,to:2*Math.PI};
        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
        });
    }
}
