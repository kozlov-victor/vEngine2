import {MathEx} from "../../misc/mathEx";
import {Game} from "../../game";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/model/renderableModel";
import {noop} from "@engine/misc/object";
import {Point2d} from "@engine/geometry/point2d";

const r:(obj:ParticlePropertyDesc)=>number
    = (obj:ParticlePropertyDesc)=>MathEx.random(obj.from,obj.to);

interface ParticlePropertyDesc {
    from:number,
    to:number
}

type RenderableCloneable = RenderableModel & {clone:()=>RenderableCloneable}

interface ParticleHolder {
    particle:RenderableCloneable,
    lifeTime:number,
    createdTime:number,
}


export class ParticleSystem extends RenderableModel {

    readonly type:string = 'ParticleSystem';
    numOfParticlesToEmit:ParticlePropertyDesc = {from:1,to:10};
    particleAngle:ParticlePropertyDesc = {from:0,to:Math.PI*2};
    particleVelocity:ParticlePropertyDesc = {from:1,to:100};
    particleLiveTime:ParticlePropertyDesc = {from:100,to:1000};
    emissionRadius:number = 0;
    emissionPosition:Point2d = new Point2d();

    private _particles:ParticleHolder[] = [];
    private _prototypes:RenderableCloneable[] = [];
    private _onUpdateParticle:(r:RenderableModel)=>void = noop;
    private _onEmitParticle:(r:RenderableModel)=>void = noop;

    constructor(protected game:Game){
        super(game);
    }

    revalidate():void {
        if (DEBUG && !this._prototypes.length) throw new DebugError(`particle system error: add at least one object to emit`);
        if (this.particleAngle.to<this.particleAngle.from) this.particleAngle.to += 2*Math.PI;
    }

    addParticle(r:RenderableCloneable):void {
        if (DEBUG && !r.clone) {
            console.error(r);
            throw new DebugError(`can not add particle: model does not implemet cloneable interface`);
        }
        this._prototypes.push(r);
    }

    emit():void {

        if (DEBUG && !this.getLayer()) {
            console.error(this);
            throw new DebugError(`particle system is detached`);
        }

        const num:number = r(this.numOfParticlesToEmit);
        for (let i:number = 0;i<num;i++) {
            const particleProto:RenderableCloneable = this._prototypes[MathEx.randomInt(0,this._prototypes.length-1)];
            const particle = particleProto.clone();
            this._onEmitParticle(particle);
            const angle:number = r(this.particleAngle);
            const vel:number = r(this.particleVelocity);
            particle.velocity.x = vel*Math.cos(angle);
            particle.velocity.y = vel*Math.sin(angle);
            particle.pos.x = r({from:-this.emissionRadius,to:+this.emissionRadius});
            particle.pos.y = r({from:-this.emissionRadius,to:+this.emissionRadius});
            particle.pos.add(this.emissionPosition);
            const lifeTime:number = r(this.particleLiveTime);
            const createdTime:number = this.game.getTime();
            this._particles.push({particle,lifeTime,createdTime});
            this.appendChild(particle);
        }
    }

    update():void {
        super.update();
        const time:number = this.game.getTime();
        this._particles.forEach((holder:ParticleHolder)=>{
            this._onUpdateParticle(holder.particle);
            if (time - holder.createdTime > holder.lifeTime) {
                this._particles.splice(this._particles.indexOf(holder),1);
                holder.particle.kill();
            }
        });
    }

    onUpdateParticle(onUpdateParticle:(r:RenderableModel)=>void):void {
        this._onUpdateParticle = onUpdateParticle;
    }

    onEmitParticle(onEmitParticle:(r:RenderableModel)=>void):void {
        this._onEmitParticle = onEmitParticle;
    }

    draw():boolean{
        return true; // do nothing
    }

}