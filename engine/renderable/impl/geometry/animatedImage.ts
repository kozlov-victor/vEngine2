import {Game} from "@engine/core/game";
import {ICloneable, Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Image} from "@engine/renderable/impl/geometry/image";


export class AnimatedImage extends Image implements ICloneable<AnimatedImage>{

    public readonly type:string = 'AnimatedImage';


    private _currFrameAnimation:Optional<AbstractFrameAnimation<any>>;
    private _frameAnimations:{[name:string]:AbstractFrameAnimation<any>} = {};

    constructor(game:Game){
        super(game);
    }

    public revalidate():void {
        Object.keys(this._frameAnimations).forEach((key:string)=>{
           this._frameAnimations[key].revalidate();
        });
        super.revalidate();
    }

    public clone():AnimatedImage {
        const cloned:AnimatedImage = new AnimatedImage(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }


    public addFrameAnimation(name:string,fa:AbstractFrameAnimation<any>):void {
        if (DEBUG && fa.target!==undefined) {
            throw new DebugError(`can not add FrameAnimation: this animation is already attached to another AnimatedImage object`);
        }
        fa.name = name;
        this._frameAnimations[name] = fa;
        fa.target = this;
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
        if (this._currFrameAnimation) this._currFrameAnimation.update();
    }


    public kill():void {
        super.kill();
    }

    protected setClonedProperties(cloned:AnimatedImage):void {

        if (DEBUG && !('clone' in this)) {
            console.error(this);
            throw new DebugError(`can not clone sprite: cloneable interface is not implemented`);
        }
        Object.keys(this._frameAnimations).forEach((key:string)=>{
            const fr:AbstractFrameAnimation<any> = this._frameAnimations[key].clone();
            fr.afterCloned(cloned);
            cloned.addFrameAnimation(key,fr);
        });
        if (this._currFrameAnimation) {
            cloned.playFrameAnimation(this._currFrameAnimation.name);
        }
        super.setClonedProperties(cloned);
    }
}