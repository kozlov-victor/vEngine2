import {Scene} from "@engine/scene/scene";
import {SceneLifeCycleState} from "@engine/scene/sceneLifeCicleState";
import {DebugError} from "@engine/debug/debugError";
import {TaskQueue} from "@engine/resources/taskQueue";
import {GAME_EVENTS} from "@engine/core/game";

type Constructor<T> = { new (scene:Scene): T }

export abstract class ResourceAutoHolder {

    public static getInstance<T>(this: Constructor<T>): T {
        return undefined!;// dummy impl, real impl is provided in __injectResourceHolder function
    }

    protected onPreloading(taskQueue:TaskQueue):void{
        //  method stub for autogenerator
    }

    public constructor(protected scene:Scene) {
        if (DEBUG) {
            if (scene.lifeCycleState!==SceneLifeCycleState.CREATED) {
                throw new DebugError(`ResourceAutoHolder can be instantiated only on CREATED scene lifecycle phase`);
            }
        }
        let alreadyPreloaded = false;
        scene.getGame().loadEventHandler.on(GAME_EVENTS.PRELOADING, e=>{
            if (alreadyPreloaded) return;
            this.onPreloading(e.taskQueue!);
            alreadyPreloaded = true;
        });
    }

}
