import {DebugError} from "@engine/debug/debugError";
import {Incrementer} from "@engine/resources/incrementer";


export class TaskRef {

    public readonly id:number = Incrementer.getValue();

}

export class Queue {
    public onResolved:()=>void;
    public onProgress:(n:number)=>void;

    private _tasksResolved:number = 0;
    private _tasks:(()=>void)[] = [];
    private _tasksProgressById:{[taskId:string]:number} = {};
    private _completed:boolean = false;
    private _nextTaskIndex:number = 0;
    private _currProgress:number = 0;
    private _isStarted:boolean = false;

    constructor(){

    }

    public progressTask(taskRef:TaskRef,progress:number):void{
        if (progress===1) return; // this task will be processed by "resolveTask" fn
        const taskId:number = taskRef.id;
        this._tasksProgressById[taskId] = progress;
        if (this.onProgress) this.onProgress(this.calcProgress());
    }

    public resolveTask(taskRef:TaskRef):void{
        const taskId:number = taskRef.id;
        if (DEBUG) {
            if (this._tasksProgressById[taskId]===undefined) throw new DebugError(`can not resolve task: no task with id ${taskId}`);
            if (this._tasksProgressById[taskId]===1) throw new DebugError(`task with id ${taskId} resolved already`);
        }
        this._tasksResolved++;
        this._tasksProgressById[taskId] = 1;
        if (this._tasks.length===this._tasksResolved) {
            if (this.onProgress) this.onProgress(1);
            this._completed = true;
            if (this.onResolved) this.onResolved();
        } else {
            if (this.onProgress) this.onProgress(this.calcProgress());
            this._tasks[this._nextTaskIndex++]();
        }
    }
    public addTask(taskFn:()=>void):TaskRef {
        const taskRef:TaskRef = new TaskRef();
        this._tasks.push(taskFn);
        this._tasksProgressById[taskRef.id] = 0;
        return taskRef;
    }
    public isCompleted():boolean{
        return this._completed;
    }
    public isStarted():boolean{
        return this._isStarted;
    }

    public calcProgress():number{
        let sum:number = 0;
        Object.keys(this._tasksProgressById).forEach((taskId:string)=>{
            sum+=this._tasksProgressById[taskId]||0;
        });
        const progress = sum/this._tasks.length;
        if (progress>this._currProgress) this._currProgress = progress; // avoid progress reducing if task were added dynamically
        return this._currProgress;
    }

    public completeForced():void {
        this._completed = true;
        if (this.onResolved!==undefined) this.onResolved();
    }

    public start():void {
        this._isStarted = true;
        if (this.size()===0) {
            this._completed = true;
            if (this.onResolved) this.onResolved();
        } else {
            this._tasks[this._nextTaskIndex++]();
        }
        // this.tasks.forEach((t:Function)=>{
        //     t && t();
        // });
    }

    private size():number{
        return this._tasks.length;
    }
}
