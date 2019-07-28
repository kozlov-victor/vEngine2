import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {Image} from "@engine/renderable/impl/geometry/image";
import {DebugError} from "@engine/debug/debugError";
import {IRectJSON} from "@engine/geometry/rect";


export class AtlasFrameAnimation extends AbstractFrameAnimation<IRectJSON> implements IRevalidatable, ICloneable<AtlasFrameAnimation>{

    public readonly type:string = 'AtlasFrameAnimation';

    private _atlas:Image;

    public setAtlas(img:Image) {
        this._atlas = img;
    }

    public revalidate(){
        if (DEBUG && !this._atlas) throw new DebugError(`atlasFrameAnimation needs atlas! Invoke setAtlas(img) method`);
        super.revalidate();
    }

    public clone():this{
        return null; // todo
    }

    protected onNextFrame(i: number): void {
        const currRect:IRectJSON = this.frames[i];
        this._atlas.getSrcRect().fromJSON(currRect);
        this._atlas.size.set(this._atlas.getSrcRect().size);
    }


}