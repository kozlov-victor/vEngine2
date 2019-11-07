import {Optional} from "@engine/core/declarations";

class ProgramInstruction {
    public number:number;
    public instructions:(()=>void)[] = [];
}

class LoopContext {
    public number:number;
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
        this.ASSING_VAR(varName,data,index);
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
        this.loopContexts.push(lc);
        lc.number = this.pointer+1;
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
            this.pointer = lc.number;
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

    public ASSING_VAR(varName:string,value:any,index?:number) {
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

    public setProgram(p:Record<number,((()=>void)[])|(()=>void)|void>){
        const keys:number[] = Object.keys(p).map(s=>+s);
        // tslint:disable-next-line:no-shadowed-variable
        keys.sort((a:number,b:number):number=>{
            if (a>b) return 1;
            else return -1;
        });
        keys.forEach((k:number)=>{
            const pi:ProgramInstruction = new ProgramInstruction();
            pi.number = k;
            if (p[k]===undefined) {
                // already performed instruction like DATA
                return;
            }
            if ((p[k] as unknown as any[]).splice) {
                pi.instructions = p[k] as (()=>void)[];
            } else if ((p[k] as unknown as ()=>void).call) {
                pi.instructions = [p[k] as (()=>void)];
            }

            this.program.push(pi);
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
        const instructions:(()=>void)[] = this.program[this.pointer].instructions;
        instructions.forEach(instr=>{
            //console.log(instr);
            instr();
        });
        if (this.instructionPointSet) {
            this.instructionPointSet = false;
        }
        else this.pointer++;
        setTimeout(()=>this.RUN(),10);
    }

}



// const data = [
//     1,2,-1,0,2,45,50,-1,0,5,43,52,-1,0,7,41,52,-1,
//     1,9,37,50,-1,2,11,36,50,-1,3,13,34,49,-1,4,14,32,48,-1,
//     5,15,31,47,-1,6,16,30,45,-1,7,17,29,44,-1,8,19,28,43,-1,
//     9,20,27,41,-1,10,21,26,40,-1,11,22,25,38,-1,12,22,24,36,-1,
//     13,34,-1,14,33,-1,15,31,-1,17,29,-1,18,27,-1,
//     19,26,-1,16,28,-1,13,30,-1,11,31,-1,10,32,-1,
//     8,33,-1,7,34,-1,6,13,16,34,-1,5,12,16,35,-1,
//     4,12,16,35,-1,3,12,15,35,-1,2,35,-1,1,35,-1,
//     2,34,-1,3,34,-1,4,33,-1,6,33,-1,10,32,34,34,-1,
//     14,17,19,25,28,31,35,35,-1,15,19,23,30,36,36,-1,
//     14,18,21,21,24,30,37,37,-1,13,18,23,29,33,38,-1,
//     12,29,31,33,-1,11,13,17,17,19,19,22,22,24,31,-1,
//     10,11,17,18,22,22,24,24,29,29,-1,
//     22,23,26,29,-1,27,29,-1,28,29,-1
// ];
//
// const INT = (val:number):number=>~~val;
//
// class SCREEN {
//     public res:string = '';
//
//     private cursorPos:number = 0;
//
//     constructor(){
//
//     }
//
//     public TAB(n:number){
//         const numOfSpaces = n - this.cursorPos;
//         const newStr = new Array(numOfSpaces).fill(' ').join('');
//         this.cursorPos+=newStr.length;
//         this.res+=newStr;
//     }
//
//     public PRINT(s?:string){
//         if (!s) {
//             this.cursorPos = 0;
//             this.res+='\n';
//         }  else {
//             this.res+=s;
//             this.cursorPos+=s.length;
//         }
//     }
//
//     public DIM(varName:string){
//
//     }
//
//     public GET_VAR(varName:string){
//
//     }
// }
//
// let i=0;
// const str:string = 'BUNNY';
// const screen = new SCREEN();
//
// while (i<data.length) {
//     if (data[i]===-1) {
//         screen.PRINT();
//         i++;
//     } else {
//         const numOfSpaces = data[i];
//         screen.TAB(numOfSpaces);
//         i++;
//         const numOfLetters = data[i];
//         for (let k:number=numOfSpaces;k<=numOfLetters;k++){
//             const j=k-5*INT(k/5);
//             screen.PRINT(str[j]);
//         }
//         i++;
//     }
// }
//
// export const SCR = screen.res;
