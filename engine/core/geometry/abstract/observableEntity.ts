
import {ArrayEx} from "../../../declarations";

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

export abstract class ObservableEntity {

    protected _state = new State<number>();
    private _onChanged:Array<()=>void> = [];

    protected abstract checkObservableChanged():boolean;

    protected triggerObservable(){
        let changed:boolean = this.checkObservableChanged();
        if (!changed) return;
        for (let fn of this._onChanged) {
            fn();
        }
    }

    addListener(f:()=>void){
        this._onChanged.push(f);
    }

    removeListener(f:()=>void){
        (this._onChanged as ArrayEx<any>).remove(f);
    }

}