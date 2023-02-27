import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Circle} from "@engine/renderable/impl/geometry/circle";

export class WallDustEmitter extends AbstractParticleEmitter{

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
            this.createPrefab(ColorFactory.fromCSS(`#f1c100`))
        ];
    }

}
