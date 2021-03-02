import {ITask} from "@engine/resources/queue";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";

export class TaskQueue {

    private startScheduled:boolean = false;
    private resourceLoader:ResourceLoader = new ResourceLoader(this.game);

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

    public async waitForAllTasks():Promise<void> { // todo
        let resolveFn:()=>void;
        const p = new Promise<void>(resolve=>{
            resolveFn = resolve;
        });
        this.resourceLoader.onResolved(()=>resolveFn());
        await p;
    }

    public scheduleStart():void {
        this.startScheduled = true;
        (async ()=>{
            await Promise.resolve();
            this.resourceLoader.start();
        })();
    }

}
