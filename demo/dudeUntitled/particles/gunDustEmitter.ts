import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";

export class GunDustEmitter extends AbstractParticleEmitter {

    constructor(scene:Scene) {
        super(scene);
        this.ps.numOfParticlesToEmit = {from: 2, to: 4};
        this.ps.particleGravity.setXY(0);
        this.ps.emissionRadius = 5;
    }

    private createPrefab(color:Color) {
        const particle = new BatchedImage(this.scene.getGame());
        particle.fillColor.setFrom(color);
        particle.size.setWH(2);
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#c7c7c7`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(255, 0, 0, 0.66)`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(255, 199, 0, 0.86)`))
        ];
    }

}
