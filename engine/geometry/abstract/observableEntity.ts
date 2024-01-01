import {removeFromArray} from "@engine/misc/object";


export abstract class ObservableEntity {

    private _onChanged:(()=>void)[] = [];

    public forceTriggerChange():void {
        for (const fn of this._onChanged) {
            fn();
        }
    }

    public addOnChangeListener(f:()=>void):void{
        this._onChanged.push(f);
    }

    public removeOnChangeListener(f:()=>void):void{
        removeFromArray(this._onChanged,(it)=>it===f);
    }

    public observe(onChangedFn:()=>void):void{
        this.addOnChangeListener(onChangedFn);
    }

    protected triggerObservable():void {
        if (this._onChanged.length===0) return;
        for (const fn of this._onChanged) {
            fn();
        }
    }

}
