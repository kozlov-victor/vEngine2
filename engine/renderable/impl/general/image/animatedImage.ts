import {Game} from "@engine/core/game";
import {ICloneable, Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";


export class AnimatedImage extends Image implements ICloneable<AnimatedImage>{

    public override readonly type:string = 'AnimatedImage';

    private _currFrameAnimation:Optional<AbstractFrameAnimation<any>>;
    private _frameAnimations:{[name:string]:AbstractFrameAnimation<any>} = {};

    constructor(game:Game,texture:ITexture){
        super(game,texture);
    }

    public override revalidate():void {
        Object.keys(this._frameAnimations).forEach((key:string)=>{
           this._frameAnimations[key].revalidate();
        });
        super.revalidate();
    }

    public override clone():AnimatedImage {
        const cloned:AnimatedImage = new AnimatedImage(this.game,this.getTexture());
        this.setClonedProperties(cloned);
        return cloned;
    }


    public addFrameAnimation(fa:AbstractFrameAnimation<any>):void {
        if (DEBUG && fa._target!==undefined) {
            throw new DebugError(`can not add FrameAnimation: this animation is already attached to another AnimatedImage object`);
        }
        if (DEBUG && this._frameAnimations[fa.getName()]!==undefined) {
            throw new DebugError(`can not add FrameAnimation: another animation with name "${name}" is already attached`);
        }
        this._frameAnimations[fa.getName()] = fa;
        fa._target = this;
    }

    private findFrameAnimation(fr:string|AbstractFrameAnimation<any>):AbstractFrameAnimation<any> {
        let frameAnimation:AbstractFrameAnimation<any>;
        if (typeof fr==='string') {
            frameAnimation = this._frameAnimations[fr];
        } else frameAnimation = fr;
        if (DEBUG && !frameAnimation) throw new DebugError(`no such frame animation: '${fr}'`);
        return frameAnimation;
    }

    public playFrameAnimation(fr:string|AbstractFrameAnimation<any>):void{
        const frameAnimation = this.findFrameAnimation(fr);
        if (this._currFrameAnimation) this._currFrameAnimation.stop();
        this._currFrameAnimation = frameAnimation;
        frameAnimation.play();
    }

    public gotoAndPlay(fr:string|AbstractFrameAnimation<any>,frame:number):void{
        const frameAnimation = this.findFrameAnimation(fr);
        frameAnimation.gotoAndPlay(frame);
    }

    public gotoAndStop(fr:string|AbstractFrameAnimation<any>,frame:number):void{
        const frameAnimation = this.findFrameAnimation(fr);
        frameAnimation.gotoAndStop(frame);
        this._currFrameAnimation = undefined;
    }

    public stopFrameAnimation():void {
        if (this._currFrameAnimation!==undefined) this._currFrameAnimation.stop();
        this._currFrameAnimation = undefined;
    }

    public getCurrentFrameAnimation():Optional<AbstractFrameAnimation<any>>{
        return this._currFrameAnimation;
    }

    public getCurrentFrameAnimationName():Optional<string>{
        return this._currFrameAnimation?.getName();
    }


    public override update():void {
        super.update();
        if (this._currFrameAnimation) this._currFrameAnimation.update();
    }


    protected override setClonedProperties(cloned:AnimatedImage):void {
        super.setClonedProperties(cloned);
        Object.keys(this._frameAnimations).forEach((key:string)=>{
            const fr:AbstractFrameAnimation<any> = this._frameAnimations[key].clone();
            cloned.addFrameAnimation(fr);
        });
        if (this._currFrameAnimation) {
            cloned.playFrameAnimation(this._currFrameAnimation.getName());
        }
    }
}
