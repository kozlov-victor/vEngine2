import {removeFromArray} from "@engine/misc/object";
import {ReleasableObject} from "@engine/misc/objectPool";


export abstract class ObservableEntity extends ReleasableObject{

    private _onChanged:(()=>void)[] = [];

    public forceTriggerChange():void {
        for (const fn of this._onChanged) {
            fn();
        }
    }

    public addOnChangeListener(f:()=>void){
        this._onChanged.push(f);
    }

    public removeOnChangeListener(f:()=>void){
        removeFromArray(this._onChanged,(it)=>it===f);
    }


    public observe(onChangedFn:()=>void){
        this.addOnChangeListener(onChangedFn);
    }

    protected triggerObservable():void {
        for (const fn of this._onChanged) {
            fn();
        }
    }

}