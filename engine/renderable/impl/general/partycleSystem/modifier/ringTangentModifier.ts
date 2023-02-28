import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {IParticleModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/abstract/iParticleModifier";
import {Vec2} from "@engine/geometry/vec2";

const PI_DIV_2 = Math.PI/2;

export class RingTangentModifier  implements IParticleModifier {

    public radius = 100;
    public radiusDeviation = 5;

    public constructor(private ps:ParticleSystem) {
    }

    public onEmitParticle(p:RenderableModel) {
        const angle = MathEx.random(0,Math.PI*2);
        const vel = Math.max(Math.abs(p.velocity.x),Math.abs(p.velocity.y));
        const x = this.radius*Math.cos(angle) + MathEx.random(0,this.radiusDeviation);
        const y = this.radius*Math.sin(angle) + MathEx.random(0,this.radiusDeviation);
        p.pos.setXY(
            this.ps.emissionPosition.x+x,
            this.ps.emissionPosition.y+y
        );
        const rotated = Vec2.withAngle(new Vec2(1,1),angle+PI_DIV_2).getAngle();
        p.velocity.x = vel*Math.cos(rotated);
        p.velocity.y = vel*Math.sin(rotated);
    }

}
