import {Game} from "../../game";
import {ICloneable} from "../../declarations";
import {RenderableModel} from "../renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";
import {Shape} from "@engine/model/impl/ui/generic/shape";


export class GameObject extends RenderableModel implements ICloneable<GameObject>{

    public type:string = 'GameObject';
    public sprite:Shape;

    public groupNames:string[] = [];
    public collideWith:string[] = [];

    private _currFrameAnimation:AbstractFrameAnimation<any>;
    private _frameAnimations:{[name:string]:AbstractFrameAnimation<any>} = {};

    constructor(game:Game){
        super(game);
    }

    public revalidate():void {
        this.sprite.revalidate();
        Object.keys(this._frameAnimations).forEach((key:string)=>{
           this._frameAnimations[key].revalidate();
        });
        this.size.set(this.sprite.getSrcRect().size);
        super.revalidate();
        //if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        //}
    }

    public clone():GameObject {
        const cloned:GameObject = new GameObject(this.game);
        this.setClonedProperties(cloned);
        cloned.revalidate();
        return cloned;
    }


    public addFrameAnimation(name:string,fa:AbstractFrameAnimation<any>):void {
        fa.name = name;
        this._frameAnimations[name] = fa;
        fa.parent = this;
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
        this._currFrameAnimation.stop();
        this._currFrameAnimation = null;
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

    protected setClonedProperties(cloned:GameObject):void {

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
        super.setClonedProperties(cloned);
    }
}