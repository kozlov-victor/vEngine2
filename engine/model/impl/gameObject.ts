import {Point2d} from "../../core/geometry/point2d";
import {FrameAnimation} from "./frameAnimation";
import {SpriteSheet} from "./spriteSheet";
import {Game} from "../../core/game";
import {Cloneable} from "../../declarations";
import {RigidShape} from "../../core/physics/rigidShapes";
import {RenderableModel} from "../renderableModel";
import {BaseAbstractBehaviour} from "../../behaviour/abstract/baseAbstractBehaviour";
import {DebugError} from "@engine/debugError";



export class GameObject extends RenderableModel implements Cloneable<GameObject>{

    type:string = 'GameObject';
    spriteSheet:SpriteSheet;

    groupNames:string[] = [];
    collideWith:string[] = [];

    private _frameAnimations:{[key:string]:FrameAnimation} = {};
    private _currFrameAnimation:FrameAnimation;


    constructor(game:Game){
        super(game);
    }

    revalidate(){
        super.revalidate();
        this.spriteSheet.revalidate();
        this.width = this.spriteSheet.getFrameWidth();
        this.height = this.spriteSheet.getFrameHeight();
        if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        }
    }

    protected setClonedProperties(cloned:GameObject) {
        const spriteSheet:SpriteSheet = this.spriteSheet.clone();
        Object.keys(this._frameAnimations).forEach((name:string)=>{
            cloned.addFrameAnimation(name,this._frameAnimations[name].clone());
        });
        cloned.spriteSheet = spriteSheet;
        super.setClonedProperties(cloned);
    }

    clone():GameObject {
        const cloned:GameObject = new GameObject(this.game);
        this.setClonedProperties(cloned);
        cloned.revalidate();
        return cloned;
    }

    addFrameAnimation(name:string,fa:FrameAnimation) {
        this._frameAnimations[name] = fa;
        fa.setGameObject(this);
    }

    playFrameAnimation(fr:FrameAnimation):void;
    playFrameAnimation(fr:string):void;
    playFrameAnimation(fr:string|FrameAnimation){
        let frameAnimation:FrameAnimation;
        if (typeof fr==='string') {
            frameAnimation = this._frameAnimations[fr];
        } else frameAnimation = fr;
        if (DEBUG && !fr) throw new DebugError(`no such frame animation: ${name}`);
        if (DEBUG && !frameAnimation.getGameObject()) {
            console.error(frameAnimation);
            throw new DebugError(`frame animation is not attached to game object`);
        }
        if (DEBUG && frameAnimation.getGameObject()!==this) {
            console.error(frameAnimation);
            throw new DebugError(`frame animation is attached to another game object`);
        }
        this._currFrameAnimation = frameAnimation;
    }

    stopFrAnimation(){
        if (DEBUG && !this._currFrameAnimation) {
            throw new DebugError(`can not stop frame animation: no active frame animation found`);
        }
        this._currFrameAnimation.reset();
        this._currFrameAnimation = null;
    }

    getFrameRect(){
        return this.spriteSheet.srcRect;
    }

    update(time:number,delta:number) {
        super.update(time,delta);
        this._currFrameAnimation && this._currFrameAnimation.update(time);
    }


    draw():boolean{
        this.game.getRenderer().draw(this);
        return true;
    }


    kill(){
        super.kill();
        for (let b of this._behaviours) {
            b.destroy();
        }
    }
}