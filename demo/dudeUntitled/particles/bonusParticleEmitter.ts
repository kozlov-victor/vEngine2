import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Scene} from "@engine/scene/scene";
import {RingModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/ringModifier";

export class BonusParticleEmitter extends AbstractParticleEmitter {

    constructor(scene:Scene) {
        super(scene);
        this.ps.numOfParticlesToEmit = {from: 10, to: 30};
        const modifier = new RingModifier(this.ps);
        modifier.radius = 16;
        this.ps.onEmitParticle(p=>{
            modifier.onEmitParticle(p);
        })
    }

    private createPrefab(color:Color) {
        const particle = new Circle(this.scene.getGame());
        particle.lineWidth = 0;
        particle.fillColor = color;
        particle.radius = 1;
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#ee7e0f`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(226, 0, 245, 0.66)`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(0, 155, 255, 0.66)`))
        ];
    }

}
