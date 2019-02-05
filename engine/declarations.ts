
export interface ArrayEx<T> extends Array<T>{
    remove:Function
}

export interface MouseEventEx extends MouseEvent {
    id:number,
    wheelDelta: number,
    touches: any[]
}

export interface Cloneable<T> {
    clone:()=>T
}

export interface Revalidatable {
    revalidate:()=>void
}

