import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ICloneable} from "@engine/core/declarations";
import {DI} from "@engine/core/ioc";
import {Game} from "@engine/core/game";


export abstract class AbstractParticleEmitter {

    protected ps:ParticleSystem;

    protected abstract createParticlePrefabs():(RenderableModel & ICloneable<RenderableModel & ICloneable<any>>)[];

    @DI.Inject(Game) protected game: Game;

    protected constructor() {
        const ps = new ParticleSystem(this.game);
        ps.emissionRadius = 5;
        ps.particleVelocity = {from:40, to: 60};
        ps.numOfParticlesToEmit = {from: 1, to: 2};
        ps.emitAuto = false;
        ps.particleGravity.setFrom(ArcadePhysicsSystem.gravity);
        const prefabs = this.createParticlePrefabs();
        prefabs.forEach(p=>{
            ps.addParticlePrefab(p);
        });
        ps.appendTo(this.game.getCurrentScene());
        this.ps = ps;
    }

    public emit(x:number,y:number):void {
        if (!this.ps) return;
        this.ps.emissionPosition.setXY(x, y);
        this.ps.emit();
    }
}
