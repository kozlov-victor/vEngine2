import {Incrementer} from "@engine/resources/incrementer";


export interface ITask  {
    fn:(progress:(n:number)=>void)=>Promise<void>;
    taskId:number;
}

export class Queue {
    public onResolved:(()=>void)[] = [];
    public onProgress:(n:number)=>void;
    private _tasks:ITask[] = [];
    private _tasksProgressById:{[taskId:string]:number} = {};
    private _resolved:boolean = false;
    private _currProgress:number = 0;

    constructor(){

    }

    public addTask(task:ITask['fn']):void {
        const taskId:number = Incrementer.getValue();
        this._tasks.push({fn:task,taskId});
        this._tasksProgressById[taskId] = 0;
    }

    public isResolved():boolean{
        return this._resolved;
    }

    private calcProgress():number{
        let sum:number = 0;
        Object.keys(this._tasksProgressById).forEach((taskId:string)=>{
            sum+=this._tasksProgressById[taskId]||0;
        });
        const progress:number = sum/this._tasks.length;
        if (progress>this._currProgress) this._currProgress = progress; // avoid progress reducing if task were added dynamically
        return this._currProgress;
    }

    private progressTask(taskId:number,progress:number):void{
        if (progress===1) return; // this task will be processed by "resolveTask" fn
        this._tasksProgressById[taskId] = progress;
        if (this.onProgress!==undefined) this.onProgress(this.calcProgress());
    }

    private resolveTask(taskId:number):void{
        this._tasksProgressById[taskId] = 1;
    }

    public start():void{
        (async _=>{
            for (const task of this._tasks) {
                const {taskId,fn} = task;
                const onProgressCallBack = (n:number)=> this.progressTask(taskId,n);
                await fn(onProgressCallBack);
                this.resolveTask(taskId);
                if (this.onProgress!==undefined) this.onProgress(this.calcProgress());
            }
            this._resolved = true;
            if (this.onProgress!==undefined) this.onProgress(1);
            await Promise.resolve();
            this.onResolved.forEach(f=>f());
        })();
    }

}
