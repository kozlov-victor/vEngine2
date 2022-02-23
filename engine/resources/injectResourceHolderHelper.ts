import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Scene} from "@engine/scene/scene";
import {ClazzEx} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

const singletons:Record<string, any> = {}
export const injectResourceHolder = <T extends ResourceAutoHolder>(scene:Scene, type:ClazzEx<T,Scene>)=>{
    if (!type) {
        if (DEBUG) throw new DebugError(`field with @Resource.ResourceAutoHolder() decorator must provide type explicitly`);
    }
    const key = type.name;
    if (!singletons[key]) {
        singletons[key] = new type(scene);
    }
    return singletons[key];
}
