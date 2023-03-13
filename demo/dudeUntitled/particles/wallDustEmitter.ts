import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Scene} from "@engine/scene/scene";

export class WallDustEmitter extends AbstractParticleEmitter {

    constructor(scene:Scene) {
        super(scene);
        this.ps.numOfParticlesToEmit = {from: 20, to: 30};
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
            this.createPrefab(ColorFactory.fromCSS(`#261201`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(180, 180, 180, 0.66)`)),
            this.createPrefab(ColorFactory.fromCSS(`rgba(20, 68, 87, 0.66)`))
        ];
    }

    public override emit(x:number,y:number):void {
        this.ps.emissionPosition.setXY(x, y);
        this.ps.emitAuto = true;
        this.ps.setTimeout(()=>{
            this.ps.emitAuto = false;
        },100);
    }

}
