import {DebugError} from "@engine/debug/debugError";
import {IRectJSON} from "@engine/geometry/rect";

interface IAtlasRect {
    x:number;
    y:number;
    w:number;
    h:number;
}

export interface ITextureAtlasJSON {
    frames: Record<string, {
        frame:IAtlasRect,
    }>
    width: number;
    height: number;
}

export class TexturePackerAtlas {

    constructor(private json:ITextureAtlasJSON) {
        if (DEBUG) {
            if (!json) throw new DebugError(`expected object, but ${json} was passed`);
            if (!json.frames) throw new DebugError(`wrong structure, "frames" field not found`);
        }
    }

    public getFrameByKey(key:string):IRectJSON {
        const keys = Object.keys(this.json.frames);
        let target:ITextureAtlasJSON['frames'][''] = undefined!;
        for (const currKey of keys) {
            const fileName = currKey.split('.')[0];
            if (fileName===key) {
                target = this.json.frames[currKey];
            }
        }
        if (DEBUG && target===undefined) throw new DebugError(`no such rect: ${key}`);
        if (target.frame===undefined) {
            console.error(target);
            throw new DebugError(`wrong frame structure: {frame:{x,y,w,h}} expected`);
        }
        const frame = target.frame;
        if (frame.x===undefined || frame.y===undefined || frame.w===undefined || frame.h===undefined) {
            console.error(frame);
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
