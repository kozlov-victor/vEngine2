import {Int} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

export class CollisionGroup {
    private static _currentIndex:number = 0;
    private static _cache:Record<string, Int> = {};

    public static createGroupBitMaskByName(name:string):Int {
        if (DEBUG && this._currentIndex>=31) {
            throw new DebugError(`only up to 32 groups can be used at the same time`);
        }
        if (this._cache[name]!==undefined) return this._cache[name];
        const num = 1<<this._currentIndex as Int;
        this._cache[name] = num;
        this._currentIndex++;
        return num;
    }

    public static getBitMaskByName(name:string):Int {
        return this._cache[name];
    }

    public static reset():void {
        this._currentIndex = 0;
    }

}
