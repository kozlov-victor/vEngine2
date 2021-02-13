import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Scene, SCENE_EVENTS} from "@engine/scene/scene";
import {SceneLifeCycleState} from "@engine/scene/sceneLifeCicleState";
import {DebugError} from "@engine/debug/debugError";

export abstract class ResourceAutoHolder {

    private onPreloading(resourceLoader:ResourceLoader):void{
        //  method stub for autogenerator
    }

    public constructor(protected scene:Scene) {
        if (DEBUG) {
            if (scene.lifeCycleState!==SceneLifeCycleState.CREATED) {
                throw new DebugError(`ResourceAutoHolder can be instantiated only on CREATED scene lifecycle phase`);
            }
        }
        scene.on(SCENE_EVENTS.PRELOADING, (resourceLoader:ResourceLoader)=>this.onPreloading(resourceLoader));
    }

}
