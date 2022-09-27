import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class GroundDust {

    private ps:ParticleSystem;

    constructor(game:Game, private scene:Scene) {
        const ps = new ParticleSystem(game);
        ps.emissionRadius = 5;
        ps.particleVelocity = {from:10, to: 30};
        ps.numOfParticlesToEmit = {from: 1, to: 2};
        ps.emitAuto = false;
        const particle = new Rectangle(game);
        particle.lineWidth = 0;
        particle.fillColor = ColorFactory.fromCSS(`#363a36`);
        particle.size.setWH(2);
        ps.addParticlePrefab(particle);

        ps.appendTo(scene);
        this.ps = ps;
    }

    public emit(x:number,y:number):void {
        this.ps.pos.setXY(x, y);
        this.ps.emit();
    }

}
