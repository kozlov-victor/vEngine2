
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

export class ParticleSystem {

    type:string = 'ParticleSystem';
    pos:Point2d = new Point2d();
    numOfParticlesToEmit:ParticlePropertyDesc = {from:1,to:10};
    particleAngle:ParticlePropertyDesc = {from:0,to:0};
    particleVelocity:ParticlePropertyDesc = {from:1,to:100};
    particleLiveTime:ParticlePropertyDesc = {from:100,to:1000};
    emissionRadius:number = 0;

    private _particles:ParticleHolder[] = [];

    constructor(protected game:Game,private gameObject:Cloneable<RenderableModel>){

    }

    revalidate(){
        if (!this.gameObject) throw new DebugError(`particle system error: game object is not set`);
        if (this.particleAngle.to<this.particleAngle.from) this.particleAngle.to += 2*Math.PI;
    }

    emit(){
        for (let i = 0;i<r(this.numOfParticlesToEmit);i++) {
            let particle:RenderableModel = this.gameObject.clone();
            let angle = r(this.particleAngle);
            let vel = r(this.particleVelocity);
            particle.velocity.x = vel*Math.cos(angle);
            particle.velocity.y = vel*Math.sin(angle);
            particle.pos.x = r({from:this.pos.x-this.emissionRadius,to:this.pos.x+this.emissionRadius});
            particle.pos.y = r({from:this.pos.y-this.emissionRadius,to:this.pos.y+this.emissionRadius});
            const lifeTime = r(this.particleLiveTime);
            const createdTime:number = this.game.getTime();
            this._particles.push({particle,lifeTime,createdTime});
            this.game.getCurrScene().appendChild(particle);
        }
    }

    update(time:number,delta:number){
        this._particles.forEach((holder:ParticleHolder)=>{
            if (time - holder.createdTime > holder.lifeTime) {
                this._particles.splice(this._particles.indexOf(holder),1);
                holder.particle.kill();
            }
        });
    }
}