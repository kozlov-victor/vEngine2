
export interface ISingleton<T> {
    getInstance():T;
}

export const staticImplements = <T>()=> {
    return <U extends T>(constructor: U) => constructor;
}
