import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {IRectJSON, Rect} from "@engine/geometry/rect";


export class AtlasFrameAnimation extends AbstractFrameAnimation<IRectJSON> implements IRevalidatable, ICloneable<AtlasFrameAnimation>{

    public readonly type:string = 'AtlasFrameAnimation';


    public override revalidate():void{
        if (DEBUG && !this.target) throw new DebugError(`atlasFrameAnimation needs image sourceLink!`);
        super.revalidate();
    }

    public clone():this{
        const cloned:AtlasFrameAnimation = new AtlasFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    protected onNextFrame(i: number): void {
        const currRect:IRectJSON = this.frames[i];
        this.target.getSrcRect().fromJSON(currRect);
        const rect:Rect = this.target.getSrcRect();
        this.target.size.setWH(rect.width,rect.height);
    }

    protected override setClonedProperties(cloned: AbstractFrameAnimation<unknown>): void {
        super.setClonedProperties(cloned);
    }


}
