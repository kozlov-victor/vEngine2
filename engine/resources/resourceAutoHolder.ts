import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Scene, SCENE_EVENTS} from "@engine/scene/scene";

export abstract class ResourceAutoHolder {

    public readonly resourceLoader:ResourceLoader;

    protected onPreloading():void{}

    protected constructor(protected scene:Scene) {
        this.resourceLoader = scene.resourceLoader;
        scene.on(SCENE_EVENTS.PRELOADING, ()=>this.onPreloading());
    }

}
