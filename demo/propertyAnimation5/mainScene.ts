import {Scene} from "@engine/scene/scene";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MoveByPathAnimation} from "@engine/animation/propertyAnimation/moveByPathAnimation";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Color} from "@engine/renderer/common/color";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MathEx} from "@engine/misc/mathEx";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";

export class MainScene extends Scene {

    public onReady() {

        // created with https://editor.method.ac/
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M298.3727321057046,152.1270653836292 C369.0813467766147,-15.027008172167507 646.1200173724658,152.1270653836292 298.3727321057046,367.0394456696475 C-49.37455316105007,152.1270653836292 227.66411743479748,-15.027008172167507 298.3727321057046,152.1270653836292 z
        `);

        this.appendChild(polyLine1);

        const circle:Circle = new Circle(this.game);
        circle.radius = 6;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        (circle.fillColor as Color).setRGBA(200,122,0);
        circle.blendMode = BLEND_MODE.ADDITIVE;

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(MathEx.random(1,3));
        rect.transformPoint.setXY(rect.size.width/2,rect.size.height/2);
        (rect.fillColor as Color).setRGBA(133,200,0);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(circle);
        ps.addParticle(rect);
        ps.emissionRadius = 5;
        ps.forceDrawChildrenOnNewSurface = true;


        ps.numOfParticlesToEmit = {from:10,to:50};
        ps.particleLiveTime = {from:100,to:500};
        ps.particleAngle = {from:0,to:2*Math.PI};
        ps.size.setWH(50,50);
        this.appendChild(ps);

        const anim1 = new MoveByPathAnimation(this.game,polyLine1);
        anim1.rotate = true;
        anim1.velocity = 50;
        this.addPropertyAnimation(anim1);

        anim1.onProgress((p,a)=>{
            ps.pos.set(p);
            ps.particleAngle = {from:a-0.1,to:a+0.1};
        });

    }

}
