import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {Color} from "@engine/renderer/common/color";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";

export class GroundDustEmitter extends AbstractParticleEmitter {

    private createPrefab(color:Color) {
        const particle = new BatchedImage(this.scene.getGame());
        particle.fillColor.setFrom(color);
        particle.size.setWH(2);
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#c5c7c5`)),
            this.createPrefab(ColorFactory.fromCSS(`#808080`))
        ];
    }

}
