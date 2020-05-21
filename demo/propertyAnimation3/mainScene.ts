import {Scene} from "@engine/scene/scene";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";
import {MoveByEllipseAnimation} from "@engine/animation/propertyAnimation/moveByEllipseAnimation";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";

export class MainScene extends Scene {

    public onReady() {

        const circle:Circle = new Circle(this.game);
        circle.radius = 3;
        circle.fillColor.setRGBA(122,200,0);
        circle.blendMode = BLEND_MODE.ADDITIVE;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        const f = new GlowFilter(this.game,0.05);
        f.setGlowColor(Color.RGB(122,200,0));
        ps.filters = [f];
        ps.addParticle(circle);
        ps.emissionRadius = 8;
        ps.particleVelocity = {from:5,to:15};
        ps.particleLiveTime = {from:500,to:1500};
        this.appendChild(ps);

        const anim1 = new MoveByEllipseAnimation(this.game);
        anim1.radiusX = 200;
        anim1.radiusY = 80;
        this.addPropertyAnimation(anim1);

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.center.set(anim1.center);
        ellipse.fillColor = Color.NONE;
        ellipse.color.setRGB(233,0,0);
        ellipse.radiusX = anim1.radiusX;
        ellipse.radiusY = anim1.radiusY;
        ellipse.lineWidth = 3;
        this.prependChild(ellipse);

        anim1.onProgress((p)=>{
            ps.emissionPosition.set(p);
        });




    }

}
