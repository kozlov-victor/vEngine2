import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Scene, SCENE_EVENTS} from "@engine/scene/scene";
import {SceneLifeCycleState} from "@engine/scene/sceneLifeCicleState";
import {DebugError} from "@engine/debug/debugError";
import {container} from "webpack";
import {TaskQueue} from "@engine/resources/taskQueue";

export abstract class ResourceAutoHolder {

    protected onPreloading(taskQueue:TaskQueue):void{
        //  method stub for autogenerator
    }

    public constructor(protected scene:Scene) {
        if (DEBUG) {
            if (scene.lifeCycleState!==SceneLifeCycleState.CREATED) {
                throw new DebugError(`ResourceAutoHolder can be instantiated only on CREATED scene lifecycle phase`);
            }
        }
        scene.on(SCENE_EVENTS.PRELOADING, (taskQueue:TaskQueue)=>{
            this.onPreloading(taskQueue);
        });
    }

}
