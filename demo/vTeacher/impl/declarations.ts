

export interface ICommand {
    points?:number[];
    extra?:'clear'|'undo';
}

export interface IResponse {
    lastUpdated:number;
    commands:ICommand[];
}
