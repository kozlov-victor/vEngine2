import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {IParticleModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/abstract/iParticleModifier";

export class RingModifier  implements IParticleModifier {

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
        p.velocity.x = vel*Math.cos(angle);
        p.velocity.y = vel*Math.sin(angle);
    }

}
