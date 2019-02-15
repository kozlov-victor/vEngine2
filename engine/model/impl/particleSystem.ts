
import {MathEx} from "../../core/mathEx";
import {Game} from "../../core/game";
import {GameObject} from "./gameObject";
import {DebugError} from "@engine/debugError";
import {Point2d} from "@engine/core/geometry/point2d";
import {RenderableModel} from "@engine/model/renderableModel";
import {Cloneable} from "@engine/declarations";

let r = (obj:ParticlePropertyDesc)=>MathEx.random(obj.from,obj.to);

interface ParticlePropertyDesc {
    from:number,
    to:number
}

interface ParticleHolder {
    particle:RenderableModel,
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
    private _prototypes:RenderableModel[] = [];

    constructor(protected game:Game){
        super(game);
    }

    revalidate(){
        if (DEBUG && !this._prototypes.length) throw new DebugError(`particle system error: add at least one object to emit`);
        if (this.particleAngle.to<this.particleAngle.from) this.particleAngle.to += 2*Math.PI;
    }

    addParticle(r:RenderableModel){
        this._prototypes.push(r);
    }

    emit(){

        if (DEBUG && !this.getLayer()) {
            console.error(this);
            throw new DebugError(`particle system is detached`);
        }

        for (let i = 0;i<r(this.numOfParticlesToEmit);i++) {
            let particle:RenderableModel = this._prototypes[MathEx.random(0,this._prototypes.length-1)];
            particle = ((particle as any).clone() as RenderableModel);

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
            if (time - holder.createdTime > holder.lifeTime) {
                this._particles.splice(this._particles.indexOf(holder),1);
                holder.particle.kill();
            }
        });
    }

    draw():boolean{
        return true; // do nothing
    }

}