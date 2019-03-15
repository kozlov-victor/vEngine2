import {DebugError} from "@engine/debugError";



export class Queue{

    private tasksResolved:number = 0;
    private tasks:Function[] = [];
    private tasksProgressById:{[taskId:string]:number} = {};
    private completed:boolean = false;

    public onResolved:()=>void;
    public onProgress:(n:number)=>void;

    constructor(){

    }

    private size():number{
        return this.tasks.length;
    }

    private progressTask(taskId:number|string,progress:number){
        this.tasksProgressById[taskId] = progress;
        this.onProgress && this.onProgress(this.calcProgress());
    };

    public resolveTask(taskId:number|string){
        this.tasksResolved++;
        this.tasksProgressById[taskId] = 1;
        if (this.tasks.length===this.tasksResolved) {
            this.onProgress && this.onProgress(1);
            this.completed = true;
            if (this.onResolved) this.onResolved();
        } else {
            this.onProgress && this.onProgress(this.calcProgress());
        }
    };

    addTask(taskFn:()=>void,taskId:string|number) {
        if (this.tasksProgressById[taskId]!==undefined) return;
        this.tasks.push(taskFn);
        this.tasksProgressById[taskId] = 0;
    };

    isCompleted():boolean{
        return this.completed;
    }

    calcProgress(){
        let sum = 0;
        Object.keys(this.tasksProgressById).forEach((taskId:string)=>{
            sum+=this.tasksProgressById[taskId]||0;
        });
        return sum/this.tasks.length;
    }

    start() {
        if (this.size()===0) {
            this.completed = true;
            this.onResolved && this.onResolved();
        }
        this.tasks.forEach((t:Function)=>{
            t && t();
        });
    }
}