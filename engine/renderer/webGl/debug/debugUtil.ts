
export namespace debugUtil {

    let map:{[key:number]:string};

    export const glEnumToString = (gl:WebGLRenderingContext,glEnum:number):string=>{
        if (!map && DEBUG) {
            map = {};
            const keymap:Record<string,number> = gl as unknown as Record<string,number>;
            for (const k in keymap) {
                if (isFinite(keymap[k])) map[keymap[k]] = k;
            }
        }
        return map[glEnum];
    };

}