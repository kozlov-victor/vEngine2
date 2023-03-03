import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {IRectJSON} from "@engine/geometry/rect";


export class AtlasFrameAnimation extends AbstractFrameAnimation<IRectJSON> implements IRevalidatable, ICloneable<AtlasFrameAnimation>{

    public readonly type:string = 'AtlasFrameAnimation';

    public clone():this{
        const cloned = new AtlasFrameAnimation(this.game,{
            frames: [...this._frames],
            duration: this._duration,
            isRepeating: this._isRepeating,
        });
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    protected onNextFrame(i: number): void {
        const currRect = this._frames[i];
        this._target.srcRect.setFrom(currRect);
        const rect = this._target.srcRect;
        this._target.size.setWH(rect.width,rect.height);
    }

    protected override setClonedProperties(cloned: AbstractFrameAnimation<unknown>): void {
        super.setClonedProperties(cloned);
    }


}
