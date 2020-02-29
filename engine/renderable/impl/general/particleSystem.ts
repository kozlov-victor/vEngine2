import {MathEx} from "@engine/misc/mathEx";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {noop} from "@engine/misc/object";
import {Point2d} from "@engine/geometry/point2d";
import {Optional} from "@engine/core/declarations";

const r:(obj:IParticlePropertyDesc)=>number
    = (obj:IParticlePropertyDesc)=>MathEx.random(obj.from,obj.to);

interface IParticlePropertyDesc {
    from:number;
    to:number;
}

type RenderableCloneable = RenderableModel & {clone:()=>RenderableCloneable};

interface IParticleHolder {
    particle:RenderableCloneable;
    lifeTime:number;
    createdTime:number;
    active:boolean;
}


export class ParticleSystem extends RenderableModel {

    public readonly type:string = 'ParticleSystem';
    public enabled:boolean = true;
    public emitAuto:boolean = true;
    public numOfParticlesToEmit:IParticlePropertyDesc = {from:1,to:10};
    public particleAngle:IParticlePropertyDesc = {from:0,to:Math.PI*2};
    public particleVelocity:IParticlePropertyDesc = {from:1,to:100};
    public particleLiveTime:IParticlePropertyDesc = {from:100,to:1000};
    public emissionRadius:number = 0;
    public emissionPosition:Point2d = new Point2d();

    private _particles:IParticleHolder[] = [];
    private _prototypes:RenderableCloneable[] = [];
    private _onUpdateParticle:(r:RenderableModel)=>void = noop;
    private _onEmitParticle:(r:RenderableModel)=>void = noop;

    constructor(protected game:Game){
        super(game);
    }

    public revalidate():void {
        if (DEBUG && !this._prototypes.length) throw new DebugError(`particle system error: add at least one object to emit`);
        if (this.particleAngle.to<this.particleAngle.from) this.particleAngle.to += 2*Math.PI;
    }

    public addParticle(renderableCloneable:RenderableCloneable):void {
        if (DEBUG && !renderableCloneable.clone) {
            console.error(r);
            throw new DebugError(`can not add particle: model does not implement cloneable interface`);
        }
        renderableCloneable.revalidate();
        this._prototypes.push(renderableCloneable);
    }

    public update():void {
        if (!this.enabled) return;
        super.update();
        const time:number = this.game.getCurrentTime();
        for (const holder of this._particles) {
            if (!holder.active) continue;
            this._onUpdateParticle(holder.particle);
            if (time - holder.createdTime > holder.lifeTime) {
                holder.active = false;
                holder.particle.kill();
            }
        }
        if (this.emitAuto) this.emit();
    }

    public onUpdateParticle(onUpdateParticle:(r:RenderableModel)=>void):void {
        this._onUpdateParticle = onUpdateParticle;
    }

    public onEmitParticle(onEmitParticle:(r:RenderableModel)=>void):void {
        this._onEmitParticle = onEmitParticle;
    }

    public draw():void{}


    public emit():void {

        if (!this.enabled) return;

        if (DEBUG && !this.getLayer()) {
            console.error(this);
            throw new DebugError(`particle system is detached`);
        }

        const num:number = r(this.numOfParticlesToEmit);
        for (let i:number = 0;i<num;i++) {

            let particle:RenderableCloneable;
            let holder:Optional<IParticleHolder> =
                this._particles.filter(it=>!it.active)[0];
            if (holder===undefined) {
                const particleProto:RenderableCloneable = this._prototypes[MathEx.randomInt(0,this._prototypes.length-1)];
                particle  = particleProto.clone();
                holder = {particle,lifeTime:0,createdTime:0,active:true};
                this._particles.push(holder);
            } else {
                particle = holder.particle;
            }

            const angle:number = r(this.particleAngle);
            const vel:number = r(this.particleVelocity);
            particle.velocity.x = vel*Math.cos(angle);
            particle.velocity.y = vel*Math.sin(angle);
            particle.pos.x = r({from:-this.emissionRadius,to:+this.emissionRadius});
            particle.pos.y = r({from:-this.emissionRadius,to:+this.emissionRadius});
            particle.pos.add(this.emissionPosition);
            holder.lifeTime = r(this.particleLiveTime);
            holder.createdTime = this.game.getCurrentTime();
            holder.active = true;

            this._onEmitParticle(particle);
            this.appendChild(particle);
        }
    }

}
