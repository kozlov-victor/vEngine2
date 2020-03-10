import {IReleasealable} from "@engine/misc/objectPool";

export abstract class ReleaseableEntity implements IReleasealable{

    private _captured:boolean = false;

    public isCaptured(): boolean {
        return this._captured;
    }

    public capture(): this {
        this._captured = true;
        return this;
    }

    public release(): this {
        this._captured = false;
        return this;
    }
}
