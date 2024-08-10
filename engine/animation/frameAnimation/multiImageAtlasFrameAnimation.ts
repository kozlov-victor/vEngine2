import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {IRectJSON} from "@engine/geometry/rect";

export class MultiImageAtlasFrameAnimation extends AbstractFrameAnimation<{resource:ITexture,rect:IRectJSON}> {


    public clone(): this {
        const cloned = new MultiImageAtlasFrameAnimation(this.game,{
            frames: [...this._frames],
            duration: this._duration,
            isRepeating: this._isRepeating,
        });
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public override revalidate(): void {
        this._target.setTexture(this._frames[0].resource);
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this._target.setTexture(this._frames[i].resource);
        const currRect = this._frames[i].rect;
        this._target.srcRect.setFrom(currRect);

    }

}
