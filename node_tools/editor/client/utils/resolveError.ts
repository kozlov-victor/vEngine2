
export const resolveError = (e:any):string=>{
    return e.message || e.code || JSON.stringify(e);
}
