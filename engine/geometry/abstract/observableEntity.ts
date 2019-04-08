import {removeFromArray} from "@engine/misc/object";
import {Releasealable} from "@engine/misc/objectPool";


export abstract class ObservableEntity implements Releasealable{

    private _onChanged:Array<()=>void> = [];

    private _silent:boolean = false;
    silent<T>(val:boolean):T{
        this._silent = val;
        return this as any;
    }

    private _captured:boolean = false;
    isCaptured(): boolean {
        return this._captured;
    }

    capture(): void {
        this._captured = true;
    }

    release(): void {
        this._captured = false;
    }

    protected triggerObservable():void {
        if (this._silent) return;
        for (let fn of this._onChanged) {
            fn();
        }
    }

    forceTriggerChange():void {
        for (let fn of this._onChanged) {
            fn();
        }
    }

    addListener(f:()=>void){
        this._onChanged.push(f);
    }

    removeListener(f:()=>void){
        removeFromArray(this._onChanged,(it)=>it===f);
    }


    observe(onChangedFn:()=>void){
        this.addListener(onChangedFn);
    }

}