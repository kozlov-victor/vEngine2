import {removeFromArray} from "@engine/misc/object";
import {IReleasealable} from "@engine/misc/objectPool";


export abstract class ObservableEntity implements IReleasealable{

    private _onChanged:(()=>void)[] = [];

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