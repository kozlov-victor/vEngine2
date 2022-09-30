import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {Game} from "@engine/core/game";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

export class GroundDust {

    private ps:ParticleSystem;

    constructor(game:Game, private scene:Scene) {
        const ps = new ParticleSystem(game);
        ps.emissionRadius = 5;
        ps.particleVelocity = {from:40, to: 60};
        ps.numOfParticlesToEmit = {from: 1, to: 2};
        ps.emitAuto = false;
        ps.particleGravity = ArcadePhysicsSystem.gravity;
        const particle = new Circle(game);
        particle.lineWidth = 0;
        particle.fillColor = ColorFactory.fromCSS(`#c5c7c5`);
        particle.radius = 1;
        ps.addParticlePrefab(particle);

        ps.appendTo(scene);
        this.ps = ps;
    }

    public emit(x:number,y:number):void {
        this.ps.pos.setXY(x, y);
        this.ps.emit();
    }

}
