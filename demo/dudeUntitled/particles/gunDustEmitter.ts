import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {FlameModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/flameModifier";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Circle} from "@engine/renderable/impl/geometry/circle";

export class GunDustEmitter extends AbstractParticleEmitter {

    constructor(scene:Scene) {
        super(scene);
        this.ps.numOfParticlesToEmit = {from: 2, to: 4};
        this.ps.particleGravity.setXY(0);
        this.ps.emissionRadius = 5;
    }

    private createPrefab(color:Color) {
        const particle = new Circle(this.scene.getGame());
        particle.lineWidth = 0;
        particle.fillColor = color;
        particle.size.setWH(2);
        particle.blendMode = BLEND_MODE.ADDITIVE;
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
