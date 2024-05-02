import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {DI} from "@engine/core/ioc";

@DI.Injectable()
export class WallDustEmitter extends AbstractParticleEmitter {

    constructor() {
        super();
        this.ps.numOfParticlesToEmit = {from: 5, to: 8};
    }

    private createPrefab(color:Color) {
        const particle = new BatchedImage(this.game);
        particle.fillColor.setFrom(color);
        particle.size.setWH(3);
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#261201`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(180, 180, 180, 0.66)`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(20, 68, 87, 0.66)`))
        ];
    }

    public override emit(x:number,y:number):void {
        if (!this.ps) return;
        this.ps.emissionPosition.setXY(x, y);
        this.ps.emitAuto = true;
        this.ps.setTimeout(()=>{
            this.ps.emitAuto = false;
        },100);
    }

}
