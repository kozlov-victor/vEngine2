import {MathEx} from "@engine/misc/math/mathEx";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {noop} from "@engine/misc/object";
import {Point2d} from "@engine/geometry/point2d";
import {ICloneable, IRenderable, IUpdatable, Optional} from "@engine/core/declarations";
import {SimpleGameObjectContainer} from "../simpleGameObjectContainer";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

const rnd:(obj:IParticlePropertyDesc)=>number
    = (obj:IParticlePropertyDesc)=>MathEx.random(obj.from,obj.to);

export enum MAX_PARTICLE_CACHE_STRATEGY {
    GET_OLDEST = 1,
    IGNORE_EMISSION_IF_OVERFLOW,
}

interface IParticlePropertyDesc {
    from:number;
    to:number;
}

interface IParticleTimedPropertyDesc {
    start: IParticlePropertyDesc;
    end: IParticlePropertyDesc;
}

type tRenderableCloneable = RenderableModel & {clone:()=>tRenderableCloneable};

interface IParticleHolder {
    lifeTime:number;
    createdTime:number;
    active:boolean;
    alphaFromTo?:{start:number,end:number};
    scaleFromTo?:{start:number,end:number};
    ps: ParticleSystem;
}

type tParticle = tRenderableCloneable & ICloneable<tParticle> & IParticleHolder;

const isInactive = (p:tParticle):boolean=>{
    return !p.active;
}

const getOldestParticle = (arr:tParticle[]):tParticle=>{
    let min = arr[0].createdTime;
    let minItem = arr[0];
    for (let i=1;i<arr.length;++i) {
        const el = arr[i];
        if (!el.active) return el;
        const currMin = el.createdTime;
        if (currMin<min) {
            min = currMin;
            minItem = el;
        }
    }
    return minItem;
}

const onUpdateParticle = function(this:tParticle):void {
    const time:number = this.ps.game.getCurrentTime();
    const hasGravity = !this.ps.particleGravity.equals(0);
    (this.ps as any)._onUpdateParticle(this);
    if (hasGravity) {
        this.velocity.x += this.ps.particleGravity.x;
        this.velocity.y += this.ps.particleGravity.y;
    }
    const timePassed = time - this.createdTime;
    if (this.alphaFromTo!==undefined) {
        this.alpha =
            EasingLinear(timePassed,this.alphaFromTo.start,this.alphaFromTo.end - this.alphaFromTo.start, this.lifeTime);
    }
    if (this.scaleFromTo!==undefined) {
        const val =
            EasingLinear(timePassed,this.scaleFromTo.start,this.scaleFromTo.end - this.scaleFromTo.start, this.lifeTime);
        this.scale.setXY(val);
    }
    if (timePassed > this.lifeTime) {
        this.active = false;
        this.ps.removeChild(this);
    }
}

export class ParticleSystem extends SimpleGameObjectContainer {

    public override readonly type:string = 'ParticleSystem';

    public enabled:boolean = true;
    public emitAuto:boolean = true;
    public numOfParticlesToEmit:IParticlePropertyDesc = {from:1,to:10};
    public particleAngle:IParticlePropertyDesc = {from:0,to:Math.PI*2};
    public particleVelocity:IParticlePropertyDesc = {from:1,to:100};
    public particleLiveTime:IParticlePropertyDesc = {from:100,to:1000};
    public emissionRadius:number = 0;
    public emissionPosition:Point2d = new Point2d();
    public cacheGetPolicy: Optional<{maxParticlesInCache:number,strategy:MAX_PARTICLE_CACHE_STRATEGY}>;
    public particleGravity:Point2d = new Point2d(0,0);
    public particleAlpha:Optional<IParticleTimedPropertyDesc>;
    public particleScale:Optional<IParticleTimedPropertyDesc>;
    public declare readonly game:Game;

    private particles:tParticle[] = [];
    private _prototypes:tParticle[] = [];
    private _onUpdateParticle:(r:tParticle)=>void = noop;
    private _onEmitParticle:(r:RenderableModel)=>void = noop;

    constructor(game:Game){
        super(game);
    }

    public override revalidate():void {
        if (DEBUG && !this._prototypes.length) throw new DebugError(`particle system error: add at least one object to emit before appending particle system to scene`);
        if (this.particleAngle.to<this.particleAngle.from) this.particleAngle.to += 2*Math.PI;
    }

    public addParticlePrefab(renderableCloneable:tRenderableCloneable):void {
        if (DEBUG && !renderableCloneable.clone) {
            console.error(rnd);
            throw new DebugError(`can not add particle: model does not implement cloneable interface`);
        }
        renderableCloneable.revalidate();
        this._prototypes.push(renderableCloneable as tParticle);
    }

    public override update():void {
        if (!this.enabled) return;
        super.update();
        if (this.emitAuto) this.emit();
    }

    public onUpdateParticle(onUpdateParticle:(r:RenderableModel)=>void):void {
        this._onUpdateParticle = onUpdateParticle;
    }

    public onEmitParticle(onEmitParticle:(r:RenderableModel)=>void):void {
        this._onEmitParticle = onEmitParticle;
    }


    public emit():void {

        if (!this.enabled) return;

        const time = this.game.getCurrentTime();
        const num = rnd(this.numOfParticlesToEmit);
        for (let i = 0;i<num;++i) {
            let append:boolean;
            let particle = this.particles.find(isInactive);
            if (particle===undefined) {
                if (this.cacheGetPolicy!==undefined && this._children.length>=this.cacheGetPolicy.maxParticlesInCache) {
                    if (this.cacheGetPolicy.strategy===MAX_PARTICLE_CACHE_STRATEGY.IGNORE_EMISSION_IF_OVERFLOW) {
                        return;
                    } else {
                        particle = getOldestParticle(this.particles);
                        append = particle.isDetached();
                    }
                } else {
                    const particleProto = this._prototypes[MathEx.randomInt(0,this._prototypes.length-1)];
                    particle  = particleProto.clone() as tParticle;
                    particle.lifeTime = 0;
                    particle.createdTime = 0;
                    particle.active = true;
                    particle.ps = this;
                    const onUpdate = onUpdateParticle.bind(particle);
                    const onUpdateSelf = particle.update.bind(particle);
                    particle.update = ():void=>{
                        onUpdateSelf();
                        onUpdate();
                    };
                    append = true;
                    this.particles.push(particle);
                }
            } else {
                append = particle.isDetached();
            }

            const angle = rnd(this.particleAngle);
            const vel = rnd(this.particleVelocity);
            const velocityX = vel*Math.cos(angle);
            const velocityY = vel*Math.sin(angle);
            const rigidBody:Optional<IRigidBody> = particle.getRigidBody();
            const velocity = rigidBody===undefined?particle.velocity:rigidBody.velocity;
            velocity.setXY(velocityX,velocityY);

            const emissionRadius = MathEx.random(0,this.emissionRadius);
            const a = MathEx.random(0,Math.PI*2);
            particle.pos.x = emissionRadius*Math.cos(a) + this.emissionPosition.x;
            particle.pos.y = emissionRadius*Math.sin(a) + this.emissionPosition.y;

            if (this.particleAlpha!==undefined) {
                particle.alphaFromTo??={start:0,end:0};
                particle.alphaFromTo.start = rnd(this.particleAlpha.start);
                particle.alphaFromTo.end = rnd(this.particleAlpha.end);
                particle.alpha = particle.alphaFromTo.start;
            } else {
                particle.alphaFromTo = undefined;
            }

            if (this.particleScale!==undefined) {
                particle.scaleFromTo??={start:0,end:0};
                particle.scaleFromTo.start = rnd(this.particleScale.start);
                particle.scaleFromTo.end = rnd(this.particleScale.end);
                particle.scale.setXY(particle.scaleFromTo.start);
            } else {
                particle.scaleFromTo = undefined;
            }

            particle.lifeTime = rnd(this.particleLiveTime);
            particle.createdTime = time;
            particle.active = true;

            this._onEmitParticle(particle);
            if (append) {
                this.appendChild(particle);
                particle.moveToBack();
            }

        }

    }

}
