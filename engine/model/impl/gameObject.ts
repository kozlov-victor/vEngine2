import {Game} from "../../game";
import {Cloneable} from "../../declarations";
import {RenderableModel} from "../renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";


export class GameObject extends RenderableModel implements Cloneable<GameObject>{

    type:string = 'GameObject';
    sprite:RenderableModel;

    private _currFrameAnimation:AbstractFrameAnimation<any>;
    private _frameAnimations:{[name:string]:AbstractFrameAnimation<any>} = {};

    groupNames:string[] = [];
    collideWith:string[] = [];

    constructor(game:Game){
        super(game);
    }

    revalidate():void {
        super.revalidate();
        this.sprite.revalidate();
        Object.keys(this._frameAnimations).forEach((key:string)=>{
           this._frameAnimations[key].revalidate();
        });
        this.size.set(this.sprite.getSrcRect().size);
        //if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        //}
    }

    protected setClonedProperties(cloned:GameObject):void {

        if (DEBUG && !('clone' in this.sprite)) {
            console.error(this.sprite);
            throw new DebugError(`can not clone sprite: cloneable interface is not implemented`);
        }
        const clonedSprite:RenderableModel = (this.sprite as any as Cloneable<RenderableModel>).clone();
        if (DEBUG && ! (clonedSprite instanceof RenderableModel )) {
            console.error(this.sprite);
            throw new DebugError(`can not clone sprite: "clone"  method must return Renderable object`);
        }
        cloned.sprite = clonedSprite;
        super.setClonedProperties(cloned);
    }

    clone():GameObject {
        const cloned:GameObject = new GameObject(this.game);
        this.setClonedProperties(cloned);
        cloned.revalidate();
        return cloned;
    }


    addFrameAnimation(name:string,fa:AbstractFrameAnimation<any>):void {
        fa.name = name;
        this._frameAnimations[name] = fa;
    }

    playFrameAnimation(fr:AbstractFrameAnimation<any>):void;
    playFrameAnimation(fr:string):void;
    playFrameAnimation(fr:string|AbstractFrameAnimation<any>){
        let frameAnimation:AbstractFrameAnimation<any>;
        if (typeof fr==='string') {
            frameAnimation = this._frameAnimations[fr];
        } else frameAnimation = fr;
        if (DEBUG && !frameAnimation) throw new DebugError(`no such frame animation: '${fr}'`);
        if (this._currFrameAnimation) this._currFrameAnimation.stop();
        this._currFrameAnimation = frameAnimation;
        frameAnimation.play();
    }

    stopFrameAnimation():void {
        this._currFrameAnimation.stop();
        this._currFrameAnimation = null;
    }


    update():void {
        super.update();
        this.sprite.update();
        if (this._currFrameAnimation) this._currFrameAnimation.update();
    }

    draw():boolean{
        this.sprite.draw();
        return true;
    }

    kill():void {
        super.kill();
    }
}