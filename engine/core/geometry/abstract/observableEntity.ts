

import {removeFromArray} from "@engine/core/misc/object";
import {Releasealable} from "@engine/core/misc/objectPool";
class State<T> {

    private currState:T[] = [];

    setState(...newState:T[]){
        let changed:boolean = false;
        newState.forEach((val:T,i:number)=>{
            if (this.currState[i]!==val) changed = true;
            this.currState[i] = val;
        });
        return changed;
    }

    constructor(...values:T[]){
        this.setState(...values);
    }

}

export abstract class ObservableEntity implements Releasealable{

    protected _state = new State<number>();
    private _onChanged:Array<()=>void> = [];

    private _captured:boolean = false;

    capture(): void {
        this._captured = true;
    }

    isCaptured(): boolean {
        return this._captured;
    }

    release(): void {
        this._captured = false;
    }

    protected abstract checkObservableChanged():boolean;

    protected triggerObservable(){
        let changed:boolean = this.checkObservableChanged();
        if (!changed) return;
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