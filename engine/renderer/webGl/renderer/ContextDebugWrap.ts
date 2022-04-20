
export class ContextDebugWrap {

    public static wrap(gl:WebGLRenderingContext):void {
        for (const name in gl) {
            if (typeof (gl as any)[name] ==='function') {
                if (name==='getError') continue;
                const origFn = (gl as any)[name].bind(gl);
                (gl as any)[name] = (...args:any[])=>{
                    const result = origFn(...args);
                    if (gl.getError()!==gl.NO_ERROR) {
                        console.trace(`error after call ${name}`,...args,{result});
                        throw `error after call ${name}`;
                    } else {
                        //console.log(`called ${name}`,...args,{result});
                    }
                    return result;
                }
            }
        }
    }
}
