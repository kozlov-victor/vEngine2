import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";
import {Cloneable, Revalidatable} from "@engine/declarations";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {DebugError} from "@engine/debug/debugError";
import {RectJSON} from "@engine/geometry/rect";


export class AtlasFrameAnimation extends AbstractFrameAnimation<RectJSON> implements Revalidatable, Cloneable<AtlasFrameAnimation>{

    readonly type:string = 'AtlasFrameAnimation';

    private _atlas:Image;

    setAtlas(img:Image) {
        this._atlas = img;
    }

    protected onNextFrame(i: number): void {
        const currRect:RectJSON = this.frames[i];
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