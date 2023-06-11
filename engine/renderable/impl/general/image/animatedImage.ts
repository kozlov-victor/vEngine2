import {Game} from "@engine/core/game";
import {ICloneable, Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {
    AbstractFrameAnimation,
    FRAME_ANIMATION_EVENTS
} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Point2d} from "@engine/geometry/point2d";
import {removeFromArray} from "@engine/misc/object";


export class AnimatedImage extends Image implements ICloneable<AnimatedImage>{

    public override readonly type = 'AnimatedImage' as const;
    public _currFrameAnimation:Optional<AbstractFrameAnimation<any>>;

    private _frameAnimations:AbstractFrameAnimation<any>[] = [];

    constructor(game:Game,texture:ITexture){
        super(game,texture);
    }

    public override clone():AnimatedImage {
        const cloned = new AnimatedImage(this.game,this.getTexture());
        this.setClonedProperties(cloned);
        return cloned;
    }

    public addFrameAnimation(fa:AbstractFrameAnimation<any>):void {
        if (DEBUG && fa._target!==undefined) {
            throw new DebugError(`can not add FrameAnimation: this animation is already attached to another AnimatedImage object`);
        }
        if (DEBUG && fa._target!==undefined) {
            throw new DebugError(`can not add FrameAnimation: it is already added to another AnimatedImage`);
        }
        this._frameAnimations.push(fa);
        fa._target = this;
        fa.revalidate();
    }

    public removeFrameAnimation(fa:AbstractFrameAnimation<any>) {
        removeFromArray(this._frameAnimations,it=>it===fa);
    }

    public getCurrentFrameAnimation():Optional<AbstractFrameAnimation<any>>{
        return this._currFrameAnimation;
    }

    public override update():void {
        super.update();
        this._currFrameAnimation?.update();
    }

    protected override setClonedProperties(cloned:AnimatedImage):void {
        super.setClonedProperties(cloned);
        for (const a of this._frameAnimations) {
            const fr: AbstractFrameAnimation<any> = a.clone();
            cloned.addFrameAnimation(fr);
            if (a.isPlaying()) fr.play();
        }
    }
}
