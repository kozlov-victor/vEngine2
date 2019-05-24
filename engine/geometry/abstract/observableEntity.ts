import {removeFromArray} from "@engine/misc/object";
import {Releasealable} from "@engine/misc/objectPool";


export abstract class ObservableEntity implements Releasealable{

    private _onChanged:Array<()=>void> = [];

    private _silent:boolean = false;
    silent(val:boolean):this {
        this._silent = val;
        return this;
    }

    private _captured:boolean = false;
    isCaptured(): boolean {
        return this._captured;
    }

    capture(): this {
        this._captured = true;
        return this;
    }

    release(): this {
        this._captured = false;
        return this;
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

    addOnChangeListener(f:()=>void){
        this._onChanged.push(f);
    }

    removeOnChangeListener(f:()=>void){
        removeFromArray(this._onChanged,(it)=>it===f);
    }


    observe(onChangedFn:()=>void){
        this.addOnChangeListener(onChangedFn);
    }

}