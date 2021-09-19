import {IReleasealable} from "@engine/misc/objectPool";

export abstract class ReleaseableEntity implements IReleasealable{

    private _capturedIndex:number = -1;

    public isCaptured(): boolean {
        return this._capturedIndex!==-1;
    }

    public capture(i:number): this {
        this._capturedIndex = i;
        return this;
    }

    public release(): this {
        this._capturedIndex = -1;
        return this;
    }

    public getCapturedIndex(): number {
        return this._capturedIndex;
    }

}
