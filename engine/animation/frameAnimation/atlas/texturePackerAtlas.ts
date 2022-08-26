import {DebugError} from "@engine/debug/debugError";
import {IRectJSON} from "@engine/geometry/rect";
import {Optional} from "@engine/core/declarations";

interface IRect {
    x:number;
    y:number;
    w:number;
    h:number;
}

export class TexturePackerAtlas {

    constructor(private json:any) {
        if (DEBUG) {
            if (!json.frames) throw new DebugError(`wrong structure, "frames" field not found`);
        }
    }

    public getFrameByKey(key:string):IRectJSON {
        const keys = Object.keys(this.json.frames);
        let target:Optional<{frame:IRect}> = undefined;
        for (const currKey of keys) {
            const fileName = currKey.split('.')[0];
            if (fileName===key) {
                target = this.json.frames[currKey] as {frame:IRect};
            }
        }
        if (target===undefined) throw new DebugError(`no such rect: ${key}`);
        if (target.frame===undefined) throw new DebugError(`wrong rect structure: {rect:{x,y,w,h}} expected`);
        const frame = target.frame;
        if (frame.x===undefined || frame.y===undefined || frame.w===undefined || frame.h===undefined) {
            throw new DebugError(`wrong rect structure: {x,y,w,h} expected`);
        }
        return {
            x: frame.x,
            y: frame.y,
            width: frame.w,
            height: frame.h
        };
    }

}
