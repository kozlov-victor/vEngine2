export interface IPropertyStack<T> {
    restore():void;
    save():void;
    getCurrentValue():T;
    setCurrentValue(v:T):void;
}