import {DebugError} from "@engine/debug/debugError";

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

    // private progressTask(taskId:number|string,progress:number):void{
    //     this.tasksProgressById[taskId] = progress;
    //     this.onProgress && this.onProgress(this.calcProgress());
    // };

    public resolveTask(taskId:number|string):void{
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
    public addTask(taskFn:()=>void,taskId:string|number):void {
        if (this.tasksProgressById[taskId]!==undefined) return;
        this.tasks.push(taskFn);
        this.tasksProgressById[taskId] = 0;
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