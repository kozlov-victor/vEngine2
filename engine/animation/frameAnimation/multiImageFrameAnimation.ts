import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";


export class MultiImageFrameAnimation extends AbstractFrameAnimation<ITexture> implements IRevalidatable, ICloneable<MultiImageFrameAnimation> {

    public readonly type:string = 'MultiImageFrameAnimation';

    public clone(): this {
        const cloned:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game,{
            frames: [...this._frames],
            duration: this._duration,
            isRepeating: this._isRepeating,
        });
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public override revalidate(): void {
        if (DEBUG && !this._frames.length) {
            throw new DebugError('MultiImageFrameAnimation must have at least one frame');
        }
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this._target.setTexture(this._frames[i]);
        const texture:ITexture = this._target.getTexture();
        this._target.size.setFrom(texture.size);
        this._target.srcRect.setSize(texture.size);
    }


}
