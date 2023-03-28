import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {Color} from "@engine/renderer/common/color";

export class GroundDustEmitter extends AbstractParticleEmitter {

    private createPrefab(color:Color) {
        const particle = new Circle(this.scene.getGame());
        particle.lineWidth = 0;
        particle.fillColor = color;
        particle.radius = 1;
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#c5c7c5`)),
            this.createPrefab(ColorFactory.fromCSS(`#808080`))
        ];
    }

}