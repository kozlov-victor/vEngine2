
export interface IControl {
    type:string,
    update:()=>void,
    listenTo:()=>void,
    destroy:()=>void
}