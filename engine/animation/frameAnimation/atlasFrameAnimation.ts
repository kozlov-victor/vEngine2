import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {IRectJSON, Rect} from "@engine/geometry/rect";


export class AtlasFrameAnimation extends AbstractFrameAnimation<IRectJSON> implements IRevalidatable, ICloneable<AtlasFrameAnimation>{

    public readonly type:string = 'AtlasFrameAnimation';


    public override revalidate():void{
        if (DEBUG && !this._target) throw new DebugError(`atlasFrameAnimation needs image sourceLink!`);
        super.revalidate();
    }

    public clone():this{
        const cloned:AtlasFrameAnimation = new AtlasFrameAnimation(this.game,{
            frames: [...this._frames],
            duration: this._duration,
            isRepeating: this._isRepeating,
            name: this._name
        });
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    protected onNextFrame(i: number): void {
        const currRect:IRectJSON = this._frames[i];
        this._target.getSrcRect().fromJSON(currRect);
        const rect:Rect = this._target.getSrcRect();
        this._target.size.setWH(rect.width,rect.height);
    }

    protected override setClonedProperties(cloned: AbstractFrameAnimation<unknown>): void {
        super.setClonedProperties(cloned);
    }


}
