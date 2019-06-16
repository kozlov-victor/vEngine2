
export namespace debugUtil {

    let map:{[key:number]:string};

    export const glEnumToString = (gl:WebGLRenderingContext,glEnum:number):string=>{
        if (!map) {
            map = {};
            const keymap:any = gl;
            for (let k in keymap) {
                if (isFinite(keymap[k])) map[keymap[k]] = k;
            }
        }
        return map[glEnum];
    }

}