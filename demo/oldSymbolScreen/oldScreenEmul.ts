import {Optional} from "@engine/core/declarations";

class ProgramInstruction {
    public number:number;
    public subNumber:number;
    public instruction:()=>void;
}

class LoopContext {
    public pointer:number;
    public variableName:string;
    public to:number;
    public step:number;
    public currCounter:number;
}

export class BasicEnv {

    private _data:any = [];
    private res:string = '';
    private cursorPos:number = 0;
    private variables:Record<string,any> = {};
    private program:ProgramInstruction[] = [];
    private pointer:number = 0;
    private skipCommandsWhile:Optional<string>;
    private instructionPointSet:boolean = false;

    private loopContexts:LoopContext[] = [];
    private subroutinesStack:number[] = [];
    private ended:boolean = false;

    public onCompleted:()=>void = ()=>{};
    public onScreenChanged:()=>void = ()=>{};

    public DATA(arr:any[]){
        if (this.skipCommandsWhile!==undefined) return;
        this._data.push(...arr);
    }

    public PRINT_TAB(n:number){
        if (this.skipCommandsWhile!==undefined) return;
        let numOfSpaces:number;
        if (n<this.cursorPos) {
            this.res+='\n';
            this.cursorPos = 0;
            numOfSpaces = n;
        }
        else numOfSpaces = n - this.cursorPos;
        const newStr = new Array(numOfSpaces).fill(' ').join('');
        this.cursorPos+=newStr.length;
        this.res+=newStr;
        this.onScreenChanged();
    }

    public REM(s?:string){

    }

    public READ(varName:string,index?:number) {
        if (this.skipCommandsWhile!==undefined) return;
        const data = this._data.shift();
        if (data===undefined) throw new Error(`nothing to READ`);
        this.ASSIGN_VAR(varName,data,index);
    }

    public CHR$(n:number):string {
        return String.fromCharCode(n);
    }

    public PRINT(s?:string){
        if (this.skipCommandsWhile!==undefined) return;
        if (!s) {
            this.cursorPos = 0;
            this.res+='\n';
        }  else {
            this.res+=s;
            this.cursorPos+=s.length;
        }
        if (this.res.split('\n').length>22) {
            const newRes = this.res.split('\n');
            newRes.shift();
            this.res = newRes.join('\n');
        }
        this.onScreenChanged();
    }

    public FOR(varName:string,from:number,to:number,step:number = 1){
        if (this.skipCommandsWhile!==undefined) return;
        if (step>0) {
            if (from>to) {
                this.skipCommandsWhile = varName;
                return;
            }
        } else if (step<0) {
            if (to<from) {
                this.skipCommandsWhile = varName;
                return;
            }
        }
        const lc:LoopContext = new LoopContext();
        this.variables[varName] = from;
        lc.currCounter = from;
        lc.to = to;
        lc.step = step;
        lc.variableName = varName;
        lc.pointer = this.pointer+1;
        this.loopContexts.push(lc);
    }

    public NEXT(varName:string) {
        if (this.skipCommandsWhile===varName) {
            this.skipCommandsWhile = undefined;
            return;
        }
        if (this.skipCommandsWhile!==undefined) return;
        const lcn: number = this.loopContexts.findIndex(it => it.variableName === varName);
        if (lcn===-1) throw new Error(`wrong NEXT variable: ${varName}`);
        const lc: LoopContext = this.loopContexts[lcn];
        lc.currCounter += lc.step;
        if (lc.currCounter > lc.to) {
            this.loopContexts.splice(lcn, 1);
        }
        else {
            this.pointer = lc.pointer;
            this.variables[lc.variableName] = lc.currCounter;
            this.instructionPointSet = true;
        }
    }

    public GET_VAR(varName:string,index?:number) {
        if (this.skipCommandsWhile!==undefined) return;
        if (this.variables[varName]===undefined) throw new Error(`no such variable: ${varName}`);
        if (index===undefined) {
            if (this.variables[varName].splice) throw new Error(`${varName}: wrong variable invocation: index is expected`);
            const v = this.variables[varName];
            if (v===undefined) throw new Error(`unexpected variable ${varName}`);
            return v;
        }
        if (!this.variables[varName].splice) throw new Error(`variable ${varName} is not an array`);
        if (index>this.variables[varName].length-1) throw new Error(`${varName}[${index}]: out of range`);
        const val = this.variables[varName][index];
        if (val===undefined) throw new Error(`unexpected variable ${varName}[${index}]`);
        return val;
    }

    public ASSIGN_VAR(varName:string, value:any, index?:number) {
        if (value===undefined) throw new Error(`can not assign value to ${varName}${index===undefined?'':`[${index}]`}: bad value to assign`);
        if (this.skipCommandsWhile!==undefined) return;
        if (index===undefined) this.variables[varName] = value;
        else {
            if (!this.variables[varName]) this.variables[varName] = [];
            this.variables[varName][index] = value;
        }
    }

    public GOTO(n:number){
        if (this.skipCommandsWhile!==undefined) return;
        const line = this.program.findIndex(it=>it.number===n);
        if (line===-1) throw new Error('can not GOTO line ${n}');
        this.pointer = line;
        this.instructionPointSet = true;
    }

    public CLS(){
        this.res = '';
        this.cursorPos = 0;
        this.onScreenChanged();
    }

    public IF(res:boolean,fn:()=>void) {
        if (this.skipCommandsWhile!==undefined) return;
        if (res) fn();
    }

    public INT(n:number):number{
        return ~~n;
    }

    public GOSUB(n:number){
        this.subroutinesStack.push(this.pointer+1);
        this.GOTO(n);
    }

    public RETURN(){
        const pointer:number = this.subroutinesStack.pop()!;
        if (pointer===undefined) throw new Error(`unexpected RETURN`);
        this.pointer = pointer;
        this.instructionPointSet = true;
    }

    public END(){
        this.ended = true;
    }

    public DEBUG(){
        console.log('variables',JSON.stringify(this.variables));
    }

    public setProgram(p:Record<number,((()=>void)[])|(()=>void)|void>){
        const keys:number[] = Object.keys(p).map(s=>+s);
        // tslint:disable-next-line:no-shadowed-variable
        keys.sort((a:number,b:number):number=>{
            if (a>b) return 1;
            else return -1;
        });
        keys.forEach((k:number)=>{
            if (p[k]===undefined) {
                // already performed instruction like DATA
                return;
            }
            if ((p[k] as unknown as any[]).splice!==undefined) {
                (p[k] as unknown as any[]).forEach((instr,i)=>{
                    const pi:ProgramInstruction = new ProgramInstruction();
                    pi.number = k;
                    pi.subNumber = i;
                    pi.instruction = instr as ()=>void;
                    this.program.push(pi);
                });
            } else if ((p[k] as unknown as ()=>void).call!==undefined) {
                const pi:ProgramInstruction = new ProgramInstruction();
                pi.number = k;
                pi.subNumber = 0;
                pi.instruction = p[k] as ()=>void;
                this.program.push(pi);
            }
        });
    }

    public getScreenResult():string{
        return this.res;
    }

    public RUN(){
        if (this.ended) {
            if (this.onCompleted) this.onCompleted();
            return;
        }
        const all = this.program.length;
        if (this.pointer>all-1) {
            if (this.onCompleted) this.onCompleted();
            return;
        }
        const instruction = this.program[this.pointer].instruction;
        instruction();
        if (this.instructionPointSet) {
            this.instructionPointSet = false;
        }
        else this.pointer++;
        setTimeout(()=>this.RUN(),1);
    }

}
