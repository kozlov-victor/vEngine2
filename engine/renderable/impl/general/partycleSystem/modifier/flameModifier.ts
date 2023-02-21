import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Vec2} from "@engine/geometry/vec2";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {Point2d} from "@engine/geometry/point2d";

export class FlameModifier {

    public readonly flameDirection = new Point2d(0,-200);

    public constructor(private ps:ParticleSystem) {
    }

    public onEmitParticle(p:RenderableModel) {
        const topPoint = {
            x:this.ps.emissionPosition.x + this.flameDirection.x,
            y:this.ps.emissionPosition.y + this.flameDirection.y,
        };
        const angle = Vec2.angleTo(p.pos,topPoint);
        const vel = Math.max(Math.abs(p.velocity.x),Math.abs(p.velocity.y));
        p.velocity.x = vel*Math.cos(angle);
        p.velocity.y = vel*Math.sin(angle);
    }

}
