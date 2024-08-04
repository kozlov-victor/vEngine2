import {ITask} from "@engine/resources/queue";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";

export class TaskQueue {

    private startScheduled = false;
    private resourceLoader = new ResourceLoader(this.game);

    constructor(private game:Game) {
    }

    public addNextTask(task:ITask["fn"]):void {
        if (DEBUG && !this.startScheduled) {
            throw new DebugError(`cannot add next task: invoke scheduleStart firstly`);
        }
        this.resourceLoader.addNextTask(task);
    }

    public getLoader():ResourceLoader {
        return this.resourceLoader;
    }


    public async scheduleStart():Promise<void> {
        this.startScheduled = true;
        await Promise.resolve();
        return await this.resourceLoader.start();
    }

}
