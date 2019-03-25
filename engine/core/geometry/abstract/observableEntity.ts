

import {removeFromArray} from "@engine/core/misc/object";
import {Releasealable} from "@engine/core/misc/objectPool";


export abstract class ObservableEntity implements Releasealable{

    private _onChanged:Array<()=>void> = [];

    private _captured:boolean = false;
    private _silent:boolean = false;

    capture(): void {
        this._captured = true;
    }

    silent<T>(val:boolean):T{
        this._silent = val;
        return this as any;
    }

    isCaptured(): boolean {
        return this._captured;
    }

    release(): void {
        this._captured = false;
    }

    protected triggerObservable(){
        if (this._silent) return;
        for (let fn of this._onChanged) {
            fn();
        }
    }

    forceTriggerChange(){
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