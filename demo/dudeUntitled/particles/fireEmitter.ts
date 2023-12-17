import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {FlameModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/flameModifier";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export class FireEmitter extends AbstractParticleEmitter {

    constructor(scene:Scene) {
        super(scene);
        this.ps.numOfParticlesToEmit = {from: 1, to: 5};
        this.ps.particleGravity.setXY(0);
        this.ps.emissionRadius = 20;
        const modifier = new FlameModifier(this.ps);
        modifier.flameDirection.setXY(0,-40);
        this.ps.onEmitParticle(p=>{
            modifier.onEmitParticle(p);
        })
    }

    private createPrefab(color:Color) {
        const particle = new Rectangle(this.scene.getGame());
        particle.lineWidth = 0;
        particle.fillColor = color;
        particle.size.setWH(2);
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#c7c7c7`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(194, 0, 0, 0.66)`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(255, 195, 0, 0.66)`))
        ];
    }

}
