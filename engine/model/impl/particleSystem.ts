
import {MathEx} from "../../core/mathEx";
import {Game} from "../../core/game";
import {DebugError} from "@engine/debugError";
import {RenderableModel} from "@engine/model/renderableModel";
import {noop} from "@engine/core/misc/object";

let r = (obj:ParticlePropertyDesc)=>MathEx.random(obj.from,obj.to);

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
    particleAngle:ParticlePropertyDesc = {from:0,to:0};
    particleVelocity:ParticlePropertyDesc = {from:1,to:100};
    particleLiveTime:ParticlePropertyDesc = {from:100,to:1000};
    emissionRadius:number = 0;

    private _particles:ParticleHolder[] = [];
    private _prototypes:RenderableCloneable[] = [];
    private _onUpdateParticle:(r:RenderableModel)=>void = noop;
    private _onEmitParticle:(r:RenderableModel)=>void = noop;

    constructor(protected game:Game){
        super(game);
    }

    revalidate(){
        if (DEBUG && !this._prototypes.length) throw new DebugError(`particle system error: add at least one object to emit`);
        if (this.particleAngle.to<this.particleAngle.from) this.particleAngle.to += 2*Math.PI;
    }

    addParticle(r:RenderableCloneable){
        if (DEBUG && !r.clone) {
            console.error(r);
            throw new DebugError(`can not add particle: model does not implemet cloneable interface`);
        }
        this._prototypes.push(r);
    }

    emit(){

        if (DEBUG && !this.getLayer()) {
            console.error(this);
            throw new DebugError(`particle system is detached`);
        }

        for (let i = 0;i<r(this.numOfParticlesToEmit);i++) {
            let particle:RenderableCloneable = this._prototypes[MathEx.random(0,this._prototypes.length-1)];
            particle = particle.clone();
            this._onEmitParticle(particle);
            let angle:number = r(this.particleAngle);
            let vel:number = r(this.particleVelocity);
            particle.velocity.x = vel*Math.cos(angle);
            particle.velocity.y = vel*Math.sin(angle);
            particle.pos.x = r({from:-this.emissionRadius,to:+this.emissionRadius});
            particle.pos.y = r({from:-this.emissionRadius,to:+this.emissionRadius});
            const lifeTime:number = r(this.particleLiveTime);
            const createdTime:number = this.game.getTime();
            this._particles.push({particle,lifeTime,createdTime});
            this.appendChild(particle);
        }
    }

    update(time:number,delta:number){
        super.update(time,delta);
        this._particles.forEach((holder:ParticleHolder)=>{
            this._onUpdateParticle(holder.particle);
            if (time - holder.createdTime > holder.lifeTime) {
                this._particles.splice(this._particles.indexOf(holder),1);
                holder.particle.kill();
            }
        });
    }

    onUpdateParticle(onUpdateParticle:(r:RenderableModel)=>void){
        this._onUpdateParticle = onUpdateParticle;
    }

    onEmitParticle(onEmitParticle:(r:RenderableModel)=>void){
        this._onEmitParticle = onEmitParticle;
    }

    draw():boolean{
        return true; // do nothing
    }

}