import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class CapturedObjectsByTouchIdHolder {

    private capturedObjects:Record<number, RenderableModel[]> = {};

    private _check(touchId:number){
        if (this.capturedObjects[touchId]===undefined) this.capturedObjects[touchId] = [];
    }

    public clear(touchId:number):void {
        this._check(touchId);
        this.capturedObjects[touchId].length = 0;
    }

    public add(touchId:number,obj:RenderableModel):void {
        this._check(touchId);
        this.capturedObjects[touchId].push(obj);
    }

    public getByTouchId(touchId:number):RenderableModel[] {
        this._check(touchId);
        return this.capturedObjects[touchId];
    }

}
