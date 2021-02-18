import {ITask} from "@engine/resources/queue";
import {ResourceLoader} from "@engine/resources/resourceLoader";

export class TaskQueue {

    constructor(private resourceLoader:ResourceLoader) {
    }

    public addNextTask(task:ITask["fn"]):void {
        this.resourceLoader.addNextTask(task);
    }

    public getLoader():ResourceLoader {
        return this.resourceLoader;
    }

}
