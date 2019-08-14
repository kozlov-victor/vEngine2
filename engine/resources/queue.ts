import {DebugError} from "@engine/debug/debugError";
import {Incrementer} from "@engine/resources/incrementer";


export class TaskRef {

    public readonly id:number = Incrementer.getValue();

}

export class Queue {
    public onResolved:()=>void;
    public onProgress:(n:number)=>void;

    private tasksResolved:number = 0;
    private tasks:(()=>void)[] = [];
    private tasksProgressById:{[taskId:string]:number} = {};
    private completed:boolean = false;
    private nextTaskIndex:number = 0;

    constructor(){

    }

    public progressTask(taskRef:TaskRef,progress:number):void{
        if (progress===1) return; // this task will be processed by "resolveTask" fn
        const taskId:number = taskRef.id;
        this.tasksProgressById[taskId] = progress;
        if (this.onProgress) this.onProgress(this.calcProgress());
    }

    public resolveTask(taskRef:TaskRef):void{
        const taskId:number = taskRef.id;
        if (DEBUG) {
            if (this.tasksProgressById[taskId]===undefined) throw new DebugError(`can not resolve task: no task with id ${taskId}`);
            if (this.tasksProgressById[taskId]===1) throw new DebugError(`task with id ${taskId} resolved already`);
        }
        this.tasksResolved++;
        this.tasksProgressById[taskId] = 1;
        if (this.tasks.length===this.tasksResolved) {
            if (this.onProgress) this.onProgress(1);
            this.completed = true;
            if (this.onResolved) this.onResolved();
        } else {
            if (this.onProgress) this.onProgress(this.calcProgress());
            this.tasks[this.nextTaskIndex++]();
        }
    }
    public addTask(taskFn:()=>void):TaskRef {
        const taskRef:TaskRef = new TaskRef();
        this.tasks.push(taskFn);
        this.tasksProgressById[taskRef.id] = 0;
        return taskRef;
    }
    public isCompleted():boolean{
        return this.completed;
    }

    public calcProgress():number{
        let sum:number = 0;
        Object.keys(this.tasksProgressById).forEach((taskId:string)=>{
            sum+=this.tasksProgressById[taskId]||0;
        });
        return sum/this.tasks.length;
    }

    public start():void {
        if (this.size()===0) {
            this.completed = true;
            if (this.onResolved) this.onResolved();
        } else {
            this.tasks[this.nextTaskIndex++]();
        }
        // this.tasks.forEach((t:Function)=>{
        //     t && t();
        // });
    }

    private size():number{
        return this.tasks.length;
    }
}