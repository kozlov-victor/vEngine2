import {Game} from "@engine/core/game";
import {ICloneable, Optional} from "@engine/core/declarations";
import {RenderableModel} from "../../abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Shape} from "@engine/renderable/abstract/shape";

/**
 * @deprecated
 */
export class DeprectatedGameObject extends RenderableModel implements ICloneable<DeprectatedGameObject>{

    public readonly type:string = 'GameObject';
    public sprite:Shape;

    public groupNames:string[] = [];
    public collideWith:string[] = [];

    private _currFrameAnimation:Optional<AbstractFrameAnimation<any>>;
    private _frameAnimations:{[name:string]:AbstractFrameAnimation<any>} = {};

    constructor(game:Game){
        super(game);
    }

    public revalidate():void {
        this.sprite.revalidate();
        Object.keys(this._frameAnimations).forEach((key:string)=>{
           this._frameAnimations[key].revalidate();
        });
        this.size.setWH(this.sprite.size.width,this.sprite.size.height);
        super.revalidate();
        //if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        //}
    }

    public clone():DeprectatedGameObject {
        const cloned:DeprectatedGameObject = new DeprectatedGameObject(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }


    public addFrameAnimation(name:string,fa:AbstractFrameAnimation<any>):void {
        fa.name = name;
        this._frameAnimations[name] = fa;
        //fa.target = this; todo warning
    }

    public playFrameAnimation(fr:string|AbstractFrameAnimation<any>){
        let frameAnimation:AbstractFrameAnimation<any>;
        if (typeof fr==='string') {
            frameAnimation = this._frameAnimations[fr];
        } else frameAnimation = fr;
        if (DEBUG && !frameAnimation) throw new DebugError(`no such frame animation: '${fr}'`);
        if (this._currFrameAnimation) this._currFrameAnimation.stop();
        this._currFrameAnimation = frameAnimation;
        frameAnimation.play();
    }

    public stopFrameAnimation():void {
        if (this._currFrameAnimation!==undefined) this._currFrameAnimation.stop();
        this._currFrameAnimation = undefined;
    }


    public update():void {
        super.update();
        this.sprite.update();
        if (this._currFrameAnimation) this._currFrameAnimation.update();
    }

    public draw():boolean{
        this.sprite.draw();
        return true;
    }

    public kill():void {
        super.kill();
    }

    protected setClonedProperties(cloned:DeprectatedGameObject):void {

        if (DEBUG && !('clone' in this.sprite)) {
            console.error(this.sprite);
            throw new DebugError(`can not clone sprite: cloneable interface is not implemented`);
        }
        const clonedSprite:Shape = (this.sprite as any as ICloneable<Shape>).clone();
        if (DEBUG && ! (clonedSprite instanceof RenderableModel )) {
            console.error(this.sprite);
            throw new DebugError(`can not clone sprite: "clone"  method must return Renderable object`);
        }
        cloned.sprite = clonedSprite;
        Object.keys(this._frameAnimations).forEach((key:string)=>{
            const fr:AbstractFrameAnimation<any> = this._frameAnimations[key].clone();
            //fr.afterCloned(cloned); // todo warning
            cloned.addFrameAnimation(key,fr);
        });
        if (this._currFrameAnimation) {
            cloned.playFrameAnimation(this._currFrameAnimation.name);
        }
        super.setClonedProperties(cloned);
    }
}