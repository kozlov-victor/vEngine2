import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable} from "@engine/core/declarations";
import {Scene} from "@engine/scene/scene";

export abstract class AbstractParticleEmitter {

    protected ps:ParticleSystem;

    protected abstract createParticlePrefabs():(RenderableModel & ICloneable<RenderableModel & ICloneable<any>>)[];

    constructor(protected scene:Scene) {
        const ps = new ParticleSystem(scene.getGame());
        ps.emissionRadius = 5;
        ps.particleVelocity = {from:40, to: 60};
        ps.numOfParticlesToEmit = {from: 1, to: 2};
        ps.emitAuto = false;
        ps.particleGravity.setFrom(ArcadePhysicsSystem.gravity);
        const prefabs = this.createParticlePrefabs();
        prefabs.forEach(p=>{
            ps.addParticlePrefab(p);
        });

        ps.appendTo(scene);
        this.ps = ps;
    }

    public emit(x:number,y:number):void {
        this.ps.emissionPosition.setXY(x, y);
        this.ps.emit();
    }
}
