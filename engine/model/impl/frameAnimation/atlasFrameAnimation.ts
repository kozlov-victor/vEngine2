import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/declarations";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {DebugError} from "@engine/debug/debugError";
import {IRectJSON} from "@engine/geometry/rect";


export class AtlasFrameAnimation extends AbstractFrameAnimation<IRectJSON> implements IRevalidatable, ICloneable<AtlasFrameAnimation>{

    readonly type:string = 'AtlasFrameAnimation';

    private _atlas:Image;

    setAtlas(img:Image) {
        this._atlas = img;
    }

    protected onNextFrame(i: number): void {
        const currRect:IRectJSON = this.frames[i];
        this._atlas.getSrcRect().fromJSON(currRect);
        this._atlas.size.set(this._atlas.getSrcRect().size);
    }

    revalidate(){
        if (DEBUG && !this._atlas) throw new DebugError(`atlasFrameAnimation needs atlas! Invoke setAtlas() method`);
        super.revalidate();
    }

    clone():AtlasFrameAnimation{
        return null; // todo
    }


}