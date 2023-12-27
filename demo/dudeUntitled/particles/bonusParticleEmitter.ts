import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {RingTangentModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/ringTangentModifier";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";

export class BonusParticleEmitter extends AbstractParticleEmitter {

    constructor(scene:Scene) {
        super(scene);
        this.ps.numOfParticlesToEmit = {from: 2, to: 10};
        this.ps.particleGravity.setXY(0);
        const modifier = new RingTangentModifier(this.ps);
        modifier.radius = 16;
        this.ps.onEmitParticle(p=>{
            modifier.onEmitParticle(p);
        });
    }

    private createPrefab(color:Color) {
        const particle = new BatchedImage(this.scene.getGame());
        particle.fillColor.setFrom(color);
        particle.size.setWH(1);
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#ee7e0f`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(226, 0, 245, 0.66)`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(0, 155, 255, 0.66)`))
        ];
    }

    public override emit(x:number,y:number):void {
        this.ps.emissionPosition.setXY(x, y);
        this.ps.emitAuto = true;
        this.ps.setTimeout(()=>{
            this.ps.emitAuto = false;
        },500);
    }

}
